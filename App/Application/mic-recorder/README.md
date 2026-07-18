# Mic Recorder — Multi-Mic Group Discussion Recording

Coordinator creates a session; participants join from their phone/laptop browser
(no app install needed) and each device streams its own mic audio back to the
coordinator, which saves **one separate, synchronized audio file per person**.
A synced countdown ensures every device starts and stops recording at the same
instant, and that countdown window is automatically trimmed off afterward.
Each device also keeps a robust local recording and uploads it as a backup
when the session ends — so a WiFi hiccup mid-session doesn't ruin that
person's track.

## Why this solves your problem

A single room mic blends everyone together and picks up whoever's loudest /
closest. This gives every participant their own close-up track, so you can
later: clean each one individually, align them, run separate transcription
per speaker, or just mix down something far more intelligible than the
single-mic original.

## Architecture

```
Coordinator laptop (runs this server on local WiFi)
   |
   |-- serves /coordinator dashboard (create session, QR, start/stop, live status)
   |-- serves /join/<code> page for participants
   |-- Socket.IO: receives live audio chunks + backup uploads, writes to disk
   |
Participant phones/laptops (same WiFi, browser only)
   |-- pick mic from dropdown (built-in OR a Bluetooth mic paired to THAT device)
   |-- streams ~1s audio chunks live to coordinator (MediaRecorder + WebSocket)
   |-- ALSO records one continuous local file, uploaded whole at session end
```

**On Bluetooth mics:** A BT mic always pairs to one nearby device first (that's
how Bluetooth works) — pair it to a participant's phone/laptop in the OS
Bluetooth settings, then open this app on *that* device. The BT mic will show
up in the microphone dropdown like any other input, no special handling needed.

## Running it

```bash
npm install
npm start
```

The terminal will print something like:

```
Coordinator dashboard: http://192.168.1.42:3000/coordinator
```

- Open that URL on the **coordinator's** laptop, create a session, you'll get
  a QR code + link.
- Each **participant** scans the QR (or opens the link) on their own
  phone/laptop — must be on the **same WiFi network** as the coordinator.
- They pick their mic and tap Join. The coordinator dashboard shows them
  appear live with byte counts / last-active time.
- Set the **countdown length** (default 3s) before starting — this is the
  window used to synchronize all devices and gets trimmed off automatically.
- Click **Start Recording**: every device shows a synced countdown, then
  starts recording at the same instant.
- Click **End Discussion** when the conversation is done: every device shows
  a synced wrap-up countdown, then stops recording at the same instant and
  uploads its backup file.
- The server automatically trims the countdown window off both ends of each
  participant's recording and produces a `*_synced.webm` file — download
  links appear on the dashboard once trimming completes (usually within a
  few seconds of upload).

Recordings land in `recordings/<SESSION_CODE>/`:
- `name_id.webm` — the live-streamed track (small chunks as they arrived;
  useful for monitoring during the session, not the file to use afterward)
- `name_id_localbackup.webm` — the full local recording, untrimmed
- `name_id_synced.webm` — **the file you want**: trimmed to remove the
  countdown window from both ends, aligned with every other participant's
  synced file

## Important real-world notes

1. **Network**: Everyone must be on the same WiFi/LAN (or you'll need to
   deploy the server somewhere reachable + open the port). For a single-room
   discussion, your home/office/venue WiFi is enough — no internet required.
2. **HTTPS for non-localhost mic access**: Browsers require a "secure context"
   for `getUserMedia` (mic access) on anything that isn't `localhost`. On a
   plain `http://192.168.x.x:3000` link, **Chrome on Android and most mobile
   browsers will block mic access**. Fixes, easiest first:
   - Quickest: use **ngrok** or **Cloudflare Tunnel** to get a temporary HTTPS
     URL pointing at your local server (`ngrok http 3000`) — share that link
     instead of the raw IP.
   - More permanent: get a real domain + free TLS cert (Let's Encrypt) once
     you're past prototyping.
   - Desktop Chrome/Firefox usually allow `http://<local-ip>` for mic access
     without HTTPS, but don't rely on this on phones.
3. **Synchronization**: handled automatically via the countdown mechanism
   described above — see "How synchronization works" below for details and
   honest precision expectations.
4. **Battery/connectivity**: For long sessions, ask participants to keep their
   phone screen on / plugged in — mobile browsers can throttle background
   tabs, which would interrupt `MediaRecorder`.
5. **Privacy**: Recordings are stored locally on the coordinator's machine in
   `recordings/`. Nothing leaves the local network with this setup.

## How synchronization works

Every participant's mic starts/stops at the **same real-world instant** using
a countdown-anchored design:

1. Coordinator sets a countdown length (default 3s, adjustable 1–30s) before starting.
2. Clicking **Start Recording** broadcasts one `countdown_start` event to every
   connected device at once. Each device's visible "3…2…1" countdown is just a
   cue for the room — the actual recording starts the instant each device
   receives the synced `recording_go` signal that follows the countdown.
3. Clicking **End Discussion** mirrors this: a synced wrap-up countdown plays
   on every device, then a synced `recording_stop` signal tells every device
   to stop at the same instant.
4. Since every file now has the same countdown "dead zone" at both ends, the
   server automatically trims that many seconds off **both ends** using
   `ffmpeg`, producing a `*_synced.webm` per participant — already aligned,
   ready to use.

This was verified end-to-end with a simulated multi-participant session:
synchronized start/stop signals arrived within 0–1ms of each other, and
trimming correctly removed exactly the configured countdown window from both
ends of each file.

**Honest precision note**: real devices on real WiFi will see a bit more
jitter than that simulated test — typically tens of milliseconds, from
per-device network latency and OS audio pipeline startup time. That's
comfortably fine for transcription, turn-taking analysis, or general
listening, but isn't a guarantee of sample-accurate alignment. If you ever
need tighter precision than that, a follow-up step using clap/tone
cross-correlation could remove the remaining jitter — not implemented here,
but straightforward to add on top of the trimmed files.

**Requires ffmpeg** on whatever machine runs the coordinator server (a
one-line install: `brew install ffmpeg` / `apt install ffmpeg` / ffmpeg.org
for Windows). The server checks for it at startup and logs a clear warning
if it's missing — without it, raw (untrimmed) backup recordings still work,
just without the automatic sync step.

## Troubleshooting: other devices can't reach the link

If the coordinator dashboard works fine on the coordinator's own laptop, but
other devices on the same WiFi get "connection refused" or a timeout when
opening the link, it's almost always one of two things — both are one-time
fixes, not reasons to deploy elsewhere:

**1. Windows Firewall blocking inbound connections (most common).**
Windows blocks unsolicited inbound connections to apps it doesn't recognize
by default. Fix: open **Windows Defender Firewall → Allow an app through
firewall → Change settings → Allow another app** (browse to `node.exe`,
typically `C:\Program Files\nodejs\node.exe`, if it's not already listed) →
check both **Private** and **Public** → OK. Restart the server after.

**2. The printed IP is on the wrong network adapter.**
Laptops often have multiple network adapters at once — real Wi-Fi, plus
virtual ones from VPN clients, VMware/VirtualBox, Docker Desktop, etc.
Windows sometimes names these virtual adapters generically (e.g. "Ethernet
adapter 3") instead of clearly labeling them as virtual, so it's not always
obvious from the name alone. If the server picks a virtual adapter's IP
instead of the real Wi-Fi one, other devices can never reach that address —
it doesn't actually exist on your Wi-Fi network.

The server auto-detects this: it prefers Wi-Fi-named adapters first, then
non-virtual Ethernet-named ones, and explicitly avoids common virtual-adapter
name patterns (VPN clients, VMware, Docker, etc). If you have more than one
network adapter, the startup log will list all of them so you can sanity-check
the selection, e.g.:

```
Detected multiple network adapters on this machine:
  Ethernet adapter 3: 10.8.0.5
  Wi-Fi: 192.168.1.42  <-- selected above
```

If it ever picks the wrong one anyway (every name-based heuristic has limits),
override it directly:

```bash
# Mac/Linux
HOST_IP=192.168.1.42 npm start

# Windows PowerShell
$env:HOST_IP="192.168.1.42"; npm start
```

To find the right IP yourself: run `ipconfig` (Windows) or `ifconfig` /
`ip addr` (Mac/Linux) and use the IPv4 address listed under your actual
Wi-Fi adapter.

## Extending later

- **Per-track levels / waveforms** on the dashboard — straightforward addition
  using the Web Audio API data already being computed client-side.
- **Auto speaker transcription** — feed each `*_synced.webm` file through a
  speech-to-text API/model separately, then merge by timestamp into a single
  transcript labeled by speaker name (since you already know who's who, and
  the files are already time-aligned).
- **Cloud deployment** — if participants won't be in the same room/WiFi, move
  this server to a small cloud VM and keep everything else identical; you'd
  just need HTTPS (see above) and a public reachable address.
