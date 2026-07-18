require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { execFile, spawn } = require('child_process');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const os = require('os');
const { connectDB, Device, Session, Recording, Segment, ProcessingJob } = require('../../models/index.js');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 5e6 // allow decent-sized audio chunks over the socket
});

const PORT = process.env.PORT || 3000;
const RECORDINGS_DIR = path.join(__dirname, '..', 'recordings');

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

// ---------- In-memory session state ----------
// sessions[sessionCode] = {
//   code, name, createdAt,
//   status: 'open' | 'counting_in' | 'recording' | 'counting_out' | 'stopped',
//   countdownSeconds: number,           // configured by coordinator before starting
//   recordingStartedAt: epoch ms|null,  // when MediaRecorder.start() was broadcast (sync anchor)
//   recordingStoppedAt: epoch ms|null,  // when stop was broadcast
//   participants: { [participantId]: { name, socketId, deviceInfo, connectedAt, fileStream,
//                                       fileName, bytesReceived, lastChunkAt,
//                                       localBackupStream, uploadedLocalFile, trimmedFileName, trimStatus } }
// }
const sessions = {};

// Patterns commonly used by virtual/non-physical adapters that should NOT be
// offered as the "share this with participants" address, since devices on the
// real Wi-Fi network usually can't reach them. Note: on Windows, VPN/virtual
// adapters are frequently named generically (e.g. "Ethernet adapter 3" or
// "Ethernet adapter vEthernet (...)") rather than self-identifying as virtual,
// so name-matching alone can't reliably tell a real Ethernet port from a fake
// one. That's why Wi-Fi-named adapters are tried as a dedicated, higher-priority
// tier below, instead of being lumped in with "Ethernet" at equal priority.
const VIRTUAL_ADAPTER_PATTERNS = [
  /vmware/i, /virtualbox/i, /vbox/i, /hyper-v/i, /docker/i,
  /vethernet/i, /loopback/i, /tap/i, /tun/i, /wsl/i,
  /vpn/i, /tailscale/i, /zerotier/i, /radmin/i, /ppp/i
];

const WIFI_ADAPTER_PATTERNS = [/wi-?fi/i, /wlan/i, /en0/i, /wlan0/i, /airport/i];
const ETHERNET_ADAPTER_PATTERNS = [/ethernet/i, /eth0/i, /local area connection/i];

function listIPv4Candidates() {
  const ifaces = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        candidates.push({ name, address: iface.address });
      }
    }
  }
  return candidates;
}

function isVirtual(c) {
  return VIRTUAL_ADAPTER_PATTERNS.some(p => p.test(c.name));
}

function getLocalIp() {
  if (process.env.HOST_IP) return process.env.HOST_IP;

  const candidates = listIPv4Candidates();
  if (candidates.length === 0) return 'localhost';

  // Tier 1: an adapter explicitly named like Wi-Fi/WLAN, not matching a virtual pattern.
  // Real wireless adapters are essentially never the thing VPN/VM software fakes,
  // so this tier is the most trustworthy signal available without OS-specific APIs.
  const wifi = candidates.find(c => WIFI_ADAPTER_PATTERNS.some(p => p.test(c.name)) && !isVirtual(c));
  if (wifi) return wifi.address;

  // Tier 2: an Ethernet-named adapter that doesn't match a known-virtual pattern.
  // Less trustworthy than tier 1 since virtual adapters often masquerade with
  // generic "Ethernet adapter N" names on Windows, but still better than nothing.
  const ethernet = candidates.find(c => ETHERNET_ADAPTER_PATTERNS.some(p => p.test(c.name)) && !isVirtual(c));
  if (ethernet) return ethernet.address;

  // Tier 3: anything at all that isn't explicitly flagged as virtual.
  const nonVirtual = candidates.find(c => !isVirtual(c));
  if (nonVirtual) return nonVirtual.address;

  // 3. Last resort: whatever we found first (better than nothing, but the
  //    startup log below will list all candidates so a person can pick manually).
  return candidates[0].address;
}

function sessionDir(sessionCode) {
  const dir = path.join(RECORDINGS_DIR, sessionCode);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function safeFileName(s) {
  return String(s).replace(/[^a-z0-9_\-]/gi, '_').slice(0, 60);
}

let ffmpegAvailable = null;
function checkFfmpeg() {
  return new Promise((resolve) => {
    execFile('ffmpeg', ['-version'], (err) => {
      ffmpegAvailable = !err;
      resolve(ffmpegAvailable);
    });
  });
}

// Trim `trimSeconds` off both the start and end of inputPath, write to outputPath.
// Uses stream copy when possible (fast, no re-encode); falls back to re-encode if needed.
function trimAudio(inputPath, outputPath, startTrimSec, endTrimSec) {
  return new Promise((resolve, reject) => {
    execFile('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      inputPath
    ], (probeErr, stdout) => {
      if (probeErr) {
        reject(new Error('ffprobe failed: ' + probeErr.message));
        return;
      }
      const duration = parseFloat(stdout.trim());
      if (isNaN(duration)) {
        reject(new Error('Could not determine duration of ' + inputPath));
        return;
      }
      const usableDuration = duration - startTrimSec - endTrimSec;
      if (usableDuration <= 0) {
        reject(new Error(
          `Recording too short to trim: total ${duration.toFixed(2)}s, ` +
          `need to remove ${startTrimSec}s + ${endTrimSec}s`
        ));
        return;
      }
      const args = [
        '-y',
        '-i', inputPath,
        '-ss', String(startTrimSec),
        '-t', String(usableDuration),
        '-c', 'copy', // fast path: no re-encode
        outputPath
      ];
      execFile('ffmpeg', args, (err) => {
        if (!err) { resolve(usableDuration); return; }
        // Stream copy can fail to cut on exact boundaries for some webm/opus files.
        // Fall back to re-encoding, which guarantees a clean trim at the cost of speed.
        const fallbackArgs = [
          '-y',
          '-i', inputPath,
          '-ss', String(startTrimSec),
          '-t', String(usableDuration),
          '-c:a', 'libopus',
          '-b:a', '128k',
          outputPath
        ];
        execFile('ffmpeg', fallbackArgs, (err2) => {
          if (err2) reject(new Error('ffmpeg trim failed: ' + err2.message));
          else resolve(usableDuration);
        });
      });
    });
  });
}

async function checkAndUpdateSessionCompletion(code) {
  const session = sessions[code];
  if (!session) return;

  const participants = Object.values(session.participants);
  if (participants.length === 0) return;

  const allFinished = participants.every(p => p.trimStatus === 'done' || p.trimStatus === 'error');
  if (allFinished) {
    const anyError = participants.some(p => p.trimStatus === 'error');
    const finalStatus = anyError ? 'failed' : 'completed';
    
    await Session.findByIdAndUpdate(session._dbId, {
      status: finalStatus
    });
    console.log(`[session] DB status updated for session ${code} -> ${finalStatus}`);
  }
}

async function runTrimForParticipant(code, participantId) {
  const session = sessions[code];
  if (!session) return;
  const p = session.participants[participantId];
  if (!p || !p.localBackupPath) return;

  const seconds = session.countdownSeconds || 0;
  const trimmedName = p.fileName.replace(/\.webm$/, '_synced.webm');
  const trimmedPath = path.join(sessionDir(code), trimmedName);
  let duration = 0;

  try {
    if (seconds <= 0) {
      // Nothing to trim (countdown was 0) — just copy the backup as the "synced" file
      fs.copyFileSync(p.localBackupPath, trimmedPath);
      try {
        await new Promise((resolve) => {
          execFile('ffprobe', [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            p.localBackupPath
          ], (err, stdout) => {
            if (!err) duration = parseFloat(stdout.trim()) || 0;
            resolve();
          });
        });
      } catch (probeErr) {
        console.error('Probe failed:', probeErr);
      }
    } else {
      duration = await trimAudio(p.localBackupPath, trimmedPath, seconds, seconds);
    }
    p.trimmedFileName = trimmedName;
    p.trimStatus = 'done';
    console.log(`[trim] done for ${p.name} in session ${code} -> ${trimmedName}`);

    if (p._dbRecId) {
      await Recording.findByIdAndUpdate(p._dbRecId, {
        status: 'finalized',
        storagePath: trimmedPath,
        durationSeconds: duration
      });
    }
  } catch (err) {
    p.trimStatus = 'error';
    p.trimError = err.message;
    console.error(`[trim] error for ${p.name} in session ${code}: ${err.message}`);

    if (p._dbRecId) {
      await Recording.findByIdAndUpdate(p._dbRecId, {
        status: 'failed'
      });
    }
  }
  broadcastSessionState(code);
  await checkAndUpdateSessionCompletion(code);
}

function publicSessionView(session) {
  return {
    code: session.code,
    name: session.name,
    status: session.status,
    createdAt: session.createdAt,
    countdownSeconds: session.countdownSeconds,
    recordingStartedAt: session.recordingStartedAt,
    recordingStoppedAt: session.recordingStoppedAt,
    participants: Object.entries(session.participants).map(([id, p]) => ({
      id,
      name: p.name,
      connected: p.connected,
      bytesReceived: p.bytesReceived,
      lastChunkAt: p.lastChunkAt,
      fileName: p.fileName,
      uploadedLocalFile: p.uploadedLocalFile || false,
      trimStatus: p.trimStatus || 'pending', // pending | trimming | done | error
      trimmedFileName: p.trimmedFileName || null,
      trimError: p.trimError || null
    }))
  };
}

function broadcastSessionState(sessionCode) {
  const session = sessions[sessionCode];
  if (!session) return;
  io.to(`coordinator:${sessionCode}`).emit('session_state', publicSessionView(session));
}

// ---------- REST API ----------

// Create a new session
app.post('/api/sessions', async (req, res) => {
  try {
    const name = (req.body && req.body.name) || 'Untitled Session';
    const code = nanoid(6).toUpperCase().replace(/[-_]/g, 'X');
    const setupMode = (req.body && req.body.setupMode) || 'wireless';
    const deviceId = (req.body && req.body.deviceId) || 'coordinator-local';
    const displayName = (req.body && req.body.coordinatorName) || 'Local Coordinator';

    let device = await Device.findOne({ deviceId });
    if (!device) {
      device = await Device.create({
        deviceId,
        displayName,
        role: 'coordinator'
      });
    }

    const dbSession = await Session.create({
      sessionCode: code,
      setupMode,
      coordinatorDevice: device._id,
      status: 'configuring',
      location: { name, point: undefined }
    });

    sessions[code] = {
      _dbId: dbSession._id,
      code,
      name,
      setupMode,
      createdAt: Date.now(),
      status: 'open', // open -> counting_in -> recording -> counting_out -> stopped
      countdownSeconds: 3,
      recordingStartedAt: null,
      recordingStoppedAt: null,
      participants: {}
    };
    sessionDir(code);
    res.json({ code, name, setupMode });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: 'Failed to create session in database' });
  }
});

// Get session state
app.get('/api/sessions/:code', (req, res) => {
  const session = sessions[req.params.code];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(publicSessionView(session));
});

// QR code / join URL for a session
app.get('/api/sessions/:code/qr', async (req, res) => {
  const session = sessions[req.params.code];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const url = `http://${getLocalIp()}:${PORT}/join/${session.code}`;
  const qrDataUrl = await QRCode.toDataURL(url, { width: 300 });
  res.json({ url, qrDataUrl });
});

// Serve coordinator dashboard
app.get('/coordinator', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'coordinator.html'));
});

// Serve participant join page
app.get('/join/:code', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'participant.html'));
});

// Download a specific participant's trimmed/synced file (or fall back to raw backup)
app.get('/api/sessions/:code/download/:participantId', (req, res) => {
  const session = sessions[req.params.code];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const p = session.participants[req.params.participantId];
  if (!p) return res.status(404).json({ error: 'Participant not found' });

  const which = req.query.file === 'raw' ? 'raw' : 'synced';
  const filePath = which === 'synced' && p.trimmedFileName
    ? path.join(sessionDir(session.code), p.trimmedFileName)
    : p.localBackupPath;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not available yet' });
  }
  res.download(filePath);
});

app.get('/', (req, res) => {
  res.redirect('/coordinator');
});

// Invoking CLI tool
app.post('/api/cli/invoke', async (req, res) => {
  try {
    const { path: inputPath, village, district, block, coordinator, language, model } = req.body;
    
    if (!inputPath) {
      return res.status(400).json({ error: 'Local file or folder path is required.' });
    }

    const resolvedPath = path.resolve(inputPath);
    if (!fs.existsSync(resolvedPath)) {
      return res.status(400).json({ error: `Path does not exist on local disk: ${resolvedPath}` });
    }

    const stat = fs.statSync(resolvedPath);
    const isFolder = stat.isDirectory();
    const code = "M-" + nanoid(6).toUpperCase().replace(/[-_]/g, 'X');

    const dbSession = await Session.create({
      sessionCode: code,
      setupMode: 'manual',
      coordinatorDevice: null,
      status: 'processing',
      location: { name: village || 'Archival Import', point: undefined },
      archivalMeta: {
        village,
        district,
        block,
        reportingManager: coordinator,
        language,
        model,
        sourcePath: resolvedPath,
        importKind: isFolder ? 'folder' : 'file'
      }
    });

    sessions[code] = {
      _dbId: dbSession._id,
      code,
      name: village || 'Archival Import',
      setupMode: 'manual',
      createdAt: Date.now(),
      status: 'stopped', // manual import is ended immediately
      countdownSeconds: 0,
      participants: {}
    };

    runLocalCliPipeline(code, resolvedPath, dbSession._id, isFolder, {
      village,
      district,
      block,
      coordinator,
      language,
      model
    });

    res.json({ sessionCode: code });
  } catch (err) {
    console.error('Error invoking CLI pipeline:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

function runLocalCliPipeline(code, resolvedPath, dbSessionId, isFolder, meta) {
  const cliToolDir = path.join(__dirname, '..', '..', 'cli-tool');
  const pythonCmd = fs.existsSync(path.join(cliToolDir, 'venv', 'Scripts', 'python.exe')) 
    ? path.join(cliToolDir, 'venv', 'Scripts', 'python.exe') 
    : 'python';

  async function runProcessFile(filePath) {
    return new Promise((resolve, reject) => {
      io.to(`cli_logs:${code}`).emit('cli_log', { message: `\n[CLI] Starting processing for: ${path.basename(filePath)}\n` });
      
      const args = [
        '-m', 'src.main', 'process-file', filePath,
        '--village', meta.village || 'Unknown',
        '--district', meta.district || 'Unknown',
        '--block', meta.block || 'Unknown',
        '--coordinator', meta.coordinator || 'Manual Import',
        '--language', meta.language || 'punjabi',
        '--model', meta.model || 'efficient'
      ];
      
      console.log(`Spawning CLI with command: ${pythonCmd} ${args.join(' ')}`);
      
      const child = spawn(pythonCmd, args, { cwd: cliToolDir });
      
      child.stdout.on('data', (data) => {
        const msg = data.toString();
        io.to(`cli_logs:${code}`).emit('cli_log', { message: msg });
        console.log(`[CLI STDOUT]: ${msg}`);
      });
      
      child.stderr.on('data', (data) => {
        const msg = data.toString();
        io.to(`cli_logs:${code}`).emit('cli_log', { message: msg });
        console.error(`[CLI STDERR]: ${msg}`);
      });
      
      child.on('close', (exitCode) => {
        if (exitCode === 0) {
          io.to(`cli_logs:${code}`).emit('cli_log', { message: `✅ [CLI] Finished successfully for: ${path.basename(filePath)}\n` });
          resolve();
        } else {
          io.to(`cli_logs:${code}`).emit('cli_log', { message: `❌ [CLI] Failed with exit code ${exitCode} for: ${path.basename(filePath)}\n` });
          reject(new Error(`CLI process exited with code ${exitCode}`));
        }
      });
    });
  }

  (async () => {
    try {
      if (isFolder) {
        io.to(`cli_logs:${code}`).emit('cli_log', { message: `📂 Scanning folder: ${resolvedPath}\n` });
        const files = fs.readdirSync(resolvedPath);
        const mediaExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.mp4', '.avi', '.mov', '.mkv', '.webm', '.mpeg'];
        const mediaFiles = files.filter(f => mediaExtensions.includes(path.extname(f).toLowerCase()));
        
        if (mediaFiles.length === 0) {
          throw new Error('No media files found in the directory.');
        }
        
        io.to(`cli_logs:${code}`).emit('cli_log', { message: `Found ${mediaFiles.length} media files to process.\n` });
        
        for (const file of mediaFiles) {
          const fullPath = path.join(resolvedPath, file);
          await runProcessFile(fullPath);
        }
      } else {
        await runProcessFile(resolvedPath);
      }
      
      await Session.findByIdAndUpdate(dbSessionId, { status: 'completed' });
      io.to(`cli_logs:${code}`).emit('cli_finished', { status: 'completed' });
    } catch (err) {
      console.error('CLI Pipeline run failed:', err);
      io.to(`cli_logs:${code}`).emit('cli_log', { message: `\n❌ Pipeline Error: ${err.message}\n` });
      await Session.findByIdAndUpdate(dbSessionId, { status: 'failed' });
      io.to(`cli_logs:${code}`).emit('cli_finished', { status: 'failed' });
    }
  })();
}

// ---------- Socket.IO realtime handling ----------

io.on('connection', (socket) => {
  let boundSessionCode = null;
  let boundParticipantId = null;
  let boundRole = null;

  // Coordinator subscribes to a session's live updates
  socket.on('coordinator_join', ({ code }) => {
    const session = sessions[code];
    if (!session) {
      socket.emit('error_message', { message: 'Session not found' });
      return;
    }
    boundSessionCode = code;
    boundRole = 'coordinator';
    socket.join(`coordinator:${code}`);
    socket.emit('session_state', publicSessionView(session));
  });

  socket.on('join_cli_logs', ({ sessionCode }) => {
    socket.join(`cli_logs:${sessionCode}`);
  });

  // Coordinator configures countdown length before starting (must be 'open' status)
  socket.on('set_countdown_seconds', ({ code, seconds }) => {
    const session = sessions[code];
    if (!session) return;
    if (session.status !== 'open') return; // can't change mid-session
    const n = Math.max(1, Math.min(30, Math.round(Number(seconds) || 3)));
    session.countdownSeconds = n;
    broadcastSessionState(code);
  });

  // Coordinator clicks "Start Recording": broadcast a synchronized countdown,
  // then a synchronized go-signal, to every participant device at once.
  // Every device calls MediaRecorder.start() the instant it receives 'recording_go' —
  // the visible countdown is just a UI cue for the room, the actual sync anchor is this event.
  socket.on('begin_start_countdown', ({ code }) => {
    const session = sessions[code];
    if (!session) return;
    if (session.status !== 'open') return;

    session.status = 'counting_in';
    broadcastSessionState(code);

    const seconds = session.countdownSeconds;
    io.to(`session:${code}`).emit('countdown_start', { seconds, phase: 'starting' });
    io.to(`coordinator:${code}`).emit('countdown_start', { seconds, phase: 'starting' });

    setTimeout(async () => {
      const s = sessions[code];
      if (!s || s.status !== 'counting_in') return; // session may have been reset/ended oddly
      s.status = 'recording';
      s.recordingStartedAt = Date.now();
      io.to(`session:${code}`).emit('recording_go', { serverTime: s.recordingStartedAt });
      io.to(`coordinator:${code}`).emit('recording_go', { serverTime: s.recordingStartedAt });
      broadcastSessionState(code);
      console.log(`[start] session ${code} recording began after ${seconds}s countdown`);

      // Update Database
      try {
        await Session.findByIdAndUpdate(s._dbId, {
          status: 'recording',
          startedAt: new Date(s.recordingStartedAt)
        });
      } catch (dbErr) {
        console.error('Error updating session start in DB:', dbErr);
      }
    }, seconds * 1000);
  });

  // Coordinator clicks "End Discussion": broadcast a synchronized wrap-up countdown,
  // then a synchronized stop-signal. Every device stops MediaRecorder the instant
  // it receives 'recording_stop'.
  socket.on('begin_stop_countdown', ({ code }) => {
    const session = sessions[code];
    if (!session) return;
    if (session.status !== 'recording') return;

    session.status = 'counting_out';
    broadcastSessionState(code);

    const seconds = session.countdownSeconds;
    io.to(`session:${code}`).emit('countdown_start', { seconds, phase: 'stopping' });
    io.to(`coordinator:${code}`).emit('countdown_start', { seconds, phase: 'stopping' });

    setTimeout(async () => {
      const s = sessions[code];
      if (!s || s.status !== 'counting_out') return;
      s.status = 'stopped';
      s.recordingStoppedAt = Date.now();
      io.to(`session:${code}`).emit('recording_stop', { serverTime: s.recordingStoppedAt });
      io.to(`coordinator:${code}`).emit('recording_stop', { serverTime: s.recordingStoppedAt });
      broadcastSessionState(code);
      console.log(`[stop] session ${code} recording stopped after ${seconds}s wrap-up countdown`);

      // Update Database
      try {
        await Session.findByIdAndUpdate(s._dbId, {
          status: 'ended',
          endedAt: new Date(s.recordingStoppedAt)
        });
      } catch (dbErr) {
        console.error('Error updating session end in DB:', dbErr);
      }
    }, seconds * 1000);
  });

  // Participant joins a session
  socket.on('participant_join', async ({ code, name, deviceInfo, participantId: customParticipantId }) => {
    const session = sessions[code];
    if (!session) {
      socket.emit('error_message', { message: 'Session not found or has ended' });
      return;
    }
    const participantId = customParticipantId || nanoid(8);
    const fileName = `${safeFileName(name || 'participant')}_${participantId}.webm`;
    const filePath = path.join(sessionDir(code), fileName);

    session.participants[participantId] = {
      name: name || `Participant ${Object.keys(session.participants).length + 1}`,
      socketId: socket.id,
      deviceInfo: deviceInfo || {},
      connectedAt: Date.now(),
      connected: true,
      fileName,
      filePath,
      fileStream: fs.createWriteStream(filePath),
      bytesReceived: 0,
      lastChunkAt: null,
      uploadedLocalFile: false
    };

    boundSessionCode = code;
    boundParticipantId = participantId;
    boundRole = 'participant';
    socket.join(`session:${code}`);

    socket.emit('joined', {
      participantId,
      sessionName: session.name,
      status: session.status,
      countdownSeconds: session.countdownSeconds
    });

    broadcastSessionState(code);
    console.log(`[join] ${name} joined session ${code} as ${participantId}`);

    // Update Database: Create Device (if not exists) and Recording
    try {
      const pDeviceId = deviceInfo?.deviceId || `relay-${participantId}`;
      const pDisplayName = name || `Participant ${Object.keys(session.participants).length + 1}`;
      
      let pDevice = await Device.findOne({ deviceId: pDeviceId });
      if (!pDevice) {
        pDevice = await Device.create({
          deviceId: pDeviceId,
          displayName: pDisplayName,
          role: 'organizer'
        });
      }

      await Session.findByIdAndUpdate(session._dbId, {
        $addToSet: { relayDevices: pDevice._id }
      });

      const dbRec = await Recording.create({
        session: session._dbId,
        channelType: 'individual',
        device: pDevice._id,
        channelLabel: pDisplayName,
        status: 'recording'
      });

      session.participants[participantId]._dbRecId = dbRec._id;
    } catch (dbErr) {
      console.error('Error logging participant join to DB:', dbErr);
    }
  });

  // Live audio chunk from participant (binary Blob/ArrayBuffer via socket.io)
  socket.on('audio_chunk', ({ code, participantId, chunk }) => {
    const session = sessions[code];
    if (!session) return;
    const p = session.participants[participantId];
    if (!p || !p.fileStream) return;

    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    p.fileStream.write(buffer);
    p.bytesReceived += buffer.length;
    p.lastChunkAt = Date.now();

    // Light-weight throttled broadcast (avoid flooding dashboard on every chunk)
    if (!p._lastBroadcast || Date.now() - p._lastBroadcast > 1000) {
      p._lastBroadcast = Date.now();
      broadcastSessionState(code);
    }
  });

  // Participant finished local high-quality recording and is uploading it as backup
  // Sent in chunks too, written to a separate "_local" file for safety / later use.
  socket.on('local_backup_chunk', ({ code, participantId, chunk, isFinal }) => {
    const session = sessions[code];
    if (!session) return;
    const p = session.participants[participantId];
    if (!p) return;

    if (!p.localBackupStream) {
      const backupName = p.fileName.replace(/\.webm$/, '_localbackup.webm');
      p.localBackupPath = path.join(sessionDir(code), backupName);
      p.localBackupStream = fs.createWriteStream(p.localBackupPath);
    }
    if (chunk) {
      p.localBackupStream.write(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    if (isFinal) {
      p.localBackupStream.end();
      p.uploadedLocalFile = true;
      p.trimStatus = 'trimming';
      broadcastSessionState(code);
      console.log(`[backup] received full local backup for ${p.name} in session ${code}`);

      // Wait for the write stream to actually flush to disk before reading it back with ffmpeg
      p.localBackupStream.once('close', () => {
        runTrimForParticipant(code, participantId).catch((err) => {
          console.error(`[trim] failed for ${p.name} in session ${code}:`, err.message);
        });
      });
    }
  });

  socket.on('disconnect', () => {
    if (boundRole === 'participant' && boundSessionCode && boundParticipantId) {
      const session = sessions[boundSessionCode];
      if (session && session.participants[boundParticipantId]) {
        session.participants[boundParticipantId].connected = false;
        broadcastSessionState(boundSessionCode);
        console.log(`[disconnect] participant ${boundParticipantId} left session ${boundSessionCode}`);
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB successfully.');
  } catch (dbErr) {
    console.error('❌ Failed to connect to MongoDB on startup:', dbErr.message);
  }

  const ip = getLocalIp();
  const allCandidates = listIPv4Candidates();

  console.log(`\nMic Recorder server running.`);
  console.log(`Coordinator dashboard: http://${ip}:${PORT}/coordinator`);
  console.log(`(Participants will join via a session-specific link/QR shown on that dashboard)\n`);

  if (allCandidates.length > 1) {
    console.log('Detected multiple network adapters on this machine:');
    for (const c of allCandidates) {
      const marker = c.address === ip ? '  <-- selected above' : '';
      console.log(`  ${c.name}: ${c.address}${marker}`);
    }
    console.log(
      `If participants can't reach the link above, your real Wi-Fi adapter may not be\n` +
      `the one selected. Either share the IP listed next to your Wi-Fi/WLAN adapter above\n` +
      `instead, or restart with: HOST_IP=<that-ip> npm start (Windows PowerShell: $env:HOST_IP="<that-ip>"; npm start)\n`
    );
  }

  const hasFfmpeg = await checkFfmpeg();
  if (!hasFfmpeg) {
    console.warn(
      '⚠️  ffmpeg/ffprobe not found on PATH. Synced/trimmed audio files will NOT be generated\n' +
      '   (raw backup recordings will still work). Install ffmpeg and restart the server to enable trimming.\n'
    );
  } else {
    console.log('✅ ffmpeg detected — synced/trimmed audio files will be generated automatically.\n');
  }
});
