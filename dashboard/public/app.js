let allRecords = [];
let chartScores = null;
let chartLatency = null;
let chartDefects = null;

// Helpers
function timeToMinutes(timeStr) {
  if (!timeStr || timeStr === 'NA' || timeStr === 'NIL' || timeStr === '') return null;
  timeStr = String(timeStr).strip ? String(timeStr).strip() : String(timeStr).trim();
  if (!isNaN(timeStr)) {
    return parseFloat(timeStr);
  }
  const parts = timeStr.split(':');
  if (parts.length >= 3) {
    const hrs = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]) || 0;
    const secs = parseFloat(parts[2]) || 0;
    return hrs * 60 + mins + secs / 60;
  }
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins + secs / 60;
  }
  return null;
}

function percentage(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

// Format minutes to HH:MM:SS
function minutesToTime(totalMins) {
  if (totalMins === null || isNaN(totalMins)) return '--:--:--';
  const totalSecs = Math.round(totalMins * 60);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return [
    String(hrs).padStart(2, '0'),
    String(mins).padStart(2, '0'),
    String(secs).padStart(2, '0')
  ].join(':');
}

// Fetch Initial Data
async function fetchData() {
  const statusEl = document.getElementById('upload-status');
  statusEl.innerText = 'Loading data...';
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    if (data.success) {
      allRecords = data.records;
      statusEl.innerText = `Loaded ${allRecords.length} records.`;
      initializeFilters();
      updateDashboard();
    } else {
      statusEl.innerText = 'Failed to load database.';
    }
  } catch (err) {
    console.error(err);
    statusEl.innerText = 'Error connecting to server.';
  }
}

// Populate filters dynamically
function initializeFilters() {
  const filterKeys = {
    'filter-build': 'Build / Version',
    'filter-sprint': 'Sprint / Cycle',
    'filter-channel': 'Channel Tested',
    'filter-language': 'Language Tested',
    'filter-category': 'Question Category',
    'filter-tester': 'Tester Name',
    'filter-type': 'Type of Question',
    'filter-status': 'Overall Test Status',
    'filter-severity': 'Defect Severity'
  };

  for (const [elementId, csvKey] of Object.entries(filterKeys)) {
    const select = document.getElementById(elementId);
    // Keep only the "All" option
    select.innerHTML = '<option value="all">All</option>';
    
    // Extract unique values
    const uniqueVals = [...new Set(allRecords.map(r => r[csvKey] ? r[csvKey].trim() : ''))]
      .filter(v => v !== '' && v !== 'NA' && v !== 'NIL')
      .sort();
      
    uniqueVals.forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.innerText = val;
      select.appendChild(opt);
    });
  }
}

// Handle Custom Date Range toggle
document.getElementById('filter-date-range').addEventListener('change', (e) => {
  const customPickers = document.getElementById('custom-date-pickers');
  if (e.target.value === 'custom') {
    customPickers.style.display = 'flex';
  } else {
    customPickers.style.display = 'none';
    updateDashboard();
  }
});

document.getElementById('date-start').addEventListener('change', updateDashboard);
document.getElementById('date-end').addEventListener('change', updateDashboard);

// Attach event listeners to all filters
const filterIds = [
  'filter-date-range', 'filter-build', 'filter-sprint', 'filter-channel',
  'filter-language', 'filter-category', 'filter-tester', 'filter-type',
  'filter-status', 'filter-severity'
];
filterIds.forEach(id => {
  document.getElementById(id).addEventListener('change', updateDashboard);
});
document.getElementById('toggle-clean-data').addEventListener('change', updateDashboard);

// Primary calculation logic
function updateDashboard() {
  // 1. Filter Records
  const dateRangeVal = document.getElementById('filter-date-range').value;
  const buildVal = document.getElementById('filter-build').value;
  const sprintVal = document.getElementById('filter-sprint').value;
  const channelVal = document.getElementById('filter-channel').value;
  const languageVal = document.getElementById('filter-language').value;
  const categoryVal = document.getElementById('filter-category').value;
  const testerVal = document.getElementById('filter-tester').value;
  const typeVal = document.getElementById('filter-type').value;
  const statusVal = document.getElementById('filter-status').value;
  const severityVal = document.getElementById('filter-severity').value;
  const excludeFailures = document.getElementById('toggle-clean-data').checked;

  let filtered = allRecords;

  // Exclude Failures toggle (Clean Data Only)
  if (excludeFailures) {
    filtered = filtered.filter(r => 
      r['Question Saved in DB?'] !== 'Not Saved' &&
      r['Answer Saved in DB?'] !== 'Not Saved' &&
      r['Q-ID Consistent Across Systems?'] !== 'Wrongly Identified as Duplicate' &&
      r['Defect Severity'] !== 'Critical'
    );
  }

  // Apply filters
  if (buildVal !== 'all') filtered = filtered.filter(r => r['Build / Version'] === buildVal);
  if (sprintVal !== 'all') filtered = filtered.filter(r => r['Sprint / Cycle'] === sprintVal);
  if (channelVal !== 'all') filtered = filtered.filter(r => r['Channel Tested'] === channelVal);
  if (languageVal !== 'all') filtered = filtered.filter(r => r['Language Tested'] === languageVal);
  if (categoryVal !== 'all') filtered = filtered.filter(r => r['Question Category'] === categoryVal);
  if (testerVal !== 'all') filtered = filtered.filter(r => r['Tester Name'] === testerVal);
  if (typeVal !== 'all') filtered = filtered.filter(r => r['Type of Question'] === typeVal);
  if (statusVal !== 'all') filtered = filtered.filter(r => r['Overall Test Status'] === statusVal);
  if (severityVal !== 'all') filtered = filtered.filter(r => r['Defect Severity'] === severityVal);

  // Apply date range filter
  if (dateRangeVal !== 'all') {
    const now = new Date('2026-07-15'); // Mocking local system baseline
    filtered = filtered.filter(r => {
      if (!r['Test Date']) return false;
      const rDate = new Date(r['Test Date']);
      if (isNaN(rDate.getTime())) return false;
      
      if (dateRangeVal === 'today') {
        return r['Test Date'] === '2026-07-15'; // For testing logic
      } else if (dateRangeVal === '7days') {
        const diffTime = Math.abs(now - rDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      } else if (dateRangeVal === '30days') {
        const diffTime = Math.abs(now - rDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      } else if (dateRangeVal === 'custom') {
        const start = document.getElementById('date-start').value;
        const end = document.getElementById('date-end').value;
        if (start && r['Test Date'] < start) return false;
        if (end && r['Test Date'] > end) return false;
        return true;
      }
      return true;
    });
  }

  // 2. Calculations
  const N = filtered.length;

  // ACE TRUST SCORE
  // A_sci: % Correct in Col 53
  const countSciCorrect = filtered.filter(r => r['Answer Scientifically Correct?'] === 'Correct').length;
  const A_sci = percentage(countSciCorrect, N);

  // A_dom: Avg(% Yes in Cols 66, 67, 68)
  const weatherRows = filtered.filter(r => r['Weather Q Answered Correctly?'] !== 'NA' && r['Weather Q Answered Correctly?'] !== 'NIL' && r['Weather Q Answered Correctly?'] !== '');
  const mandiRows = filtered.filter(r => r['Mandi Price Q Correct?'] !== 'NA' && r['Mandi Price Q Correct?'] !== 'NIL' && r['Mandi Price Q Correct?'] !== '');
  const schemeRows = filtered.filter(r => r['Scheme Q Correct?'] !== 'NA' && r['Scheme Q Correct?'] !== 'NIL' && r['Scheme Q Correct?'] !== '');
  
  const weatherAcc = weatherRows.length ? percentage(weatherRows.filter(r => r['Weather Q Answered Correctly?'] === 'Yes').length, weatherRows.length) : 100;
  const mandiAcc = mandiRows.length ? percentage(mandiRows.filter(r => r['Mandi Price Q Correct?'] === 'Yes').length, mandiRows.length) : 100;
  const schemeAcc = schemeRows.length ? percentage(schemeRows.filter(r => r['Scheme Q Correct?'] === 'Yes').length, schemeRows.length) : 100;
  const A_dom = Math.round((weatherAcc + mandiAcc + schemeAcc) / 3);

  // S_lnk: % Provided & Relevant in Col 56
  const countSourceLinks = filtered.filter(r => r['Source Links Provided?'] === 'Provided & Relevant').length;
  const S_lnk = percentage(countSourceLinks, N);

  // E_exp: % displayed = Displayed & correct = Yes
  const displayedExpertRows = filtered.filter(r => r['Expert Name Displayed?'] === 'Displayed' && r['Correct Expert Name?'] === 'Yes');
  const E_exp = percentage(displayedExpertRows.length, N);

  // Q_trn: % Correct or Good in Col 20
  const goodTransRows = filtered.filter(r => r['Translation Quality'] === 'Correct' || r['Translation Quality'] === 'Good');
  const Q_trn = percentage(goodTransRows.length, N);

  // C_chn: % Yes in Col 72
  const countChannelMatch = filtered.filter(r => r['WhatsApp vs Web Answer Match?'] === 'Yes').length;
  const C_chn = percentage(countChannelMatch, N);

  const trustScore = Math.round((0.40 * A_sci) + (0.20 * A_dom) + (0.10 * S_lnk) + (0.10 * E_exp) + (0.10 * Q_trn) + (0.10 * C_chn));

  // FARMER EXPERIENCE SCORE
  // S_rsp: Response Speed (scale response times in Col 14)
  let speedSum = 0;
  let speedCount = 0;
  filtered.forEach(r => {
    const mins = timeToMinutes(r['Respo nse Time (mins) [Auto]']);
    if (mins !== null) {
      let score = 0;
      if (mins <= 15) {
        score = 100;
      } else if (mins > 120) {
        score = 0;
      } else {
        score = 100 - ((mins - 15) / (120 - 15)) * 100;
      }
      speedSum += score;
      speedCount++;
    }
  });
  const S_rsp = speedCount ? Math.round(speedSum / speedCount) : 0;

  // S_sla: % Within SLA in Col 15
  const countSla = filtered.filter(r => r['SLA Status'] === 'Within SLA').length;
  const S_sla = percentage(countSla, N);

  // V_io: Voice mechanics average
  const voiceInWorking = percentage(filtered.filter(r => r['Voice Input Working?'] === 'Yes').length, N);
  const voiceOutWorking = percentage(filtered.filter(r => r['Voice Output Working?'] === 'Yes').length, N);
  const voiceInQuality = percentage(filtered.filter(r => r['Voice Input Quality'] === 'Clear').length, N);
  const voiceOutQuality = percentage(filtered.filter(r => r['Voice Output Quality'] === 'Clear').length, N);
  const V_io = Math.round((voiceInWorking + voiceOutWorking + voiceInQuality + voiceOutQuality) / 4);

  // N_exp: Notification Experience
  const validNotifRows = filtered.filter(r => 
    (r['Notification Received?'] === 'Received on Time' || r['Notification Received?'] === 'Received Late' || r['Notification Received?'] === 'Yes') &&
    r['Notification on Same Thread?'] === 'Yes' &&
    r['Notification Linked Correct Q-ID?'] === 'Yes'
  );
  const N_exp = percentage(validNotifRows.length, N);

  const experienceScore = Math.round((0.30 * S_rsp) + (0.20 * S_sla) + (0.20 * V_io) + (0.15 * Q_trn) + (0.15 * N_exp));

  // CRITICAL FAILURES TODAY
  const countIncorrect = filtered.filter(r => r['Answer Scientifically Correct?'] === 'Incorrect').length;
  const countDbFailure = filtered.filter(r => r['Question Saved in DB?'] === 'Not Saved' || r['Answer Saved in DB?'] === 'Not Saved').length;
  const countNotifFailure = filtered.filter(r => 
    r['Notification Received?'] === 'Not Received' || 
    r['Notification on Same Thread?'] === 'No' || 
    r['Notification Linked Correct Q-ID?'] === 'No'
  ).length;
  const countCriticalBugs = filtered.filter(r => r['Defect Severity'] === 'Critical').length;
  const criticalFailuresToday = countIncorrect + countDbFailure + countNotifFailure + countCriticalBugs;

  // RELEASE HEALTH %
  const totalPassed = filtered.filter(r => r['Overall Test Status'] === 'Pass').length;
  const passRate = percentage(totalPassed, N);
  const criticalDefectRate = percentage(countCriticalBugs, N);
  const dataIntegrityFailures = filtered.filter(r => 
    r['Question Saved in DB?'] === 'Not Saved' || 
    r['Answer Saved in DB?'] === 'Not Saved' || 
    r['Q-ID Consistent Across Systems?'] === 'Wrongly Identified as Duplicate'
  ).length;
  const dataIntegrityRate = percentage(dataIntegrityFailures, N);
  
  const rawReleaseHealth = N ? Math.round(passRate - criticalDefectRate - dataIntegrityRate) : 0;
  const releaseHealth = Math.max(0, Math.min(100, rawReleaseHealth)); // bound between 0-100 for display

  // Update Loaded records text
  const statusEl = document.getElementById('upload-status');
  if (statusEl) {
    if (excludeFailures) {
      statusEl.innerText = `Showing ${filtered.length} clean of ${allRecords.length} records.`;
    } else {
      statusEl.innerText = `Loaded ${allRecords.length} records.`;
    }
  }

  // Render Row 1 KPI Values
  document.getElementById('kpi-trust-score').innerText = `${trustScore}%`;
  document.getElementById('kpi-experience-score').innerText = `${experienceScore}%`;
  document.getElementById('kpi-critical-failures').innerText = criticalFailuresToday;
  document.getElementById('kpi-release-health').innerText = `${releaseHealth}%`;
  document.getElementById('health-progress-bar').style.width = `${releaseHealth}%`;

  // Set trend indicators (Mock values vs standard benchmark of 80%)
  const setTrend = (elId, score) => {
    const el = document.getElementById(elId);
    if (score >= 80) {
      el.innerText = '↑ Good';
      el.className = 'trend-indicator trend-up';
    } else {
      el.innerText = '↓ Low';
      el.className = 'trend-indicator trend-down';
    }
  };
  setTrend('kpi-trust-trend', trustScore);
  setTrend('kpi-experience-trend', experienceScore);

  // Fill in breakdowns
  document.getElementById('val-sci-acc').innerText = `${A_sci}%`;
  document.getElementById('val-dom-acc').innerText = `${A_dom}%`;
  document.getElementById('val-source-links').innerText = `${S_lnk}%`;
  document.getElementById('val-expert-match').innerText = `${E_exp}%`;
  document.getElementById('val-trans-trust').innerText = `${Q_trn}%`;
  document.getElementById('val-channel-match').innerText = `${C_chn}%`;

  document.getElementById('val-speed-acc').innerText = `${S_rsp}%`;
  document.getElementById('val-sla-compliance').innerText = `${S_sla}%`;
  document.getElementById('val-voice-mechanics').innerText = `${V_io}%`;
  document.getElementById('val-trans-experience').innerText = `${Q_trn}%`;
  document.getElementById('val-notif-experience').innerText = `${N_exp}%`;

  document.getElementById('val-failed-answers').innerText = countIncorrect;
  document.getElementById('val-failed-db').innerText = countDbFailure;
  document.getElementById('val-failed-notif').innerText = countNotifFailure;
  document.getElementById('val-failed-bugs').innerText = countCriticalBugs;

  document.getElementById('val-pass-rate').innerText = `${passRate}%`;
  document.getElementById('val-critical-count').innerText = countCriticalBugs;
  document.getElementById('val-data-failures').innerText = dataIntegrityFailures;


  // 3. DIAGNOSTICS
  // Stage Bottlenecks
  const stages = [
    { name: 'Authoring', key: 'Author TAT (mins) [Auto]' },
    { name: 'Review 1', key: 'Review1 TAT (mins) [Auto]' },
    { name: 'Review 2', key: 'Review2 TAT (mins) [Auto]' },
    { name: 'Review 3', key: 'Review3 TAT (mins) [Auto]' },
    { name: 'Review 4', key: 'Review4 TAT (mins) [Auto]' },
    { name: 'Review 5', key: 'Review5 TAT (mins) [Auto]' },
    { name: 'Moderator', key: 'Moderator TAT (mins) [Auto]' }
  ];

  let maxTatName = 'None';
  let maxTatTime = 0;
  const stageStats = [];

  stages.forEach(stage => {
    let sum = 0;
    let count = 0;
    filtered.forEach(r => {
      const mins = timeToMinutes(r[stage.key]);
      if (mins !== null) {
        sum += mins;
        count++;
      }
    });
    const avg = count ? sum / count : 0;
    stageStats.push({ name: stage.name, avg });
    if (avg > maxTatTime) {
      maxTatTime = avg;
      maxTatName = stage.name;
    }
  });

  document.getElementById('bottleneck-stage').innerText = maxTatName;
  document.getElementById('bottleneck-time').innerText = maxTatTime > 0 ? `${maxTatTime.toFixed(1)} mins avg` : '0 mins avg';

  // Render Horizontal bars
  const tatContainer = document.getElementById('tat-bars-container');
  tatContainer.innerHTML = '';
  const maxAvgVal = Math.max(...stageStats.map(s => s.avg), 1);
  stageStats.forEach(stat => {
    const percentWidth = (stat.avg / maxAvgVal) * 100;
    const item = document.createElement('div');
    item.className = 'tat-item';
    item.innerHTML = `
      <div class="tat-label">
        <span>${stat.name}</span>
        <strong>${stat.avg.toFixed(1)}m</strong>
      </div>
      <div class="tat-bar-bg">
        <div class="tat-bar-fill" style="width: ${percentWidth}%"></div>
      </div>
    `;
    tatContainer.appendChild(item);
  });

  // Weakest Module
  const categories = [...new Set(filtered.map(r => r['Question Category'] ? r['Question Category'].trim() : ''))]
    .filter(c => c !== '' && c !== 'NA' && c !== 'NIL');
  
  let weakestCat = 'None';
  let minAccuracy = 101;
  categories.forEach(cat => {
    const catRows = filtered.filter(r => r['Question Category'] === cat);
    const correctCount = catRows.filter(r => r['Answer Scientifically Correct?'] === 'Correct').length;
    const acc = percentage(correctCount, catRows.length);
    if (acc < minAccuracy) {
      minAccuracy = acc;
      weakestCat = cat;
    }
  });

  document.getElementById('weakest-module-name').innerText = weakestCat;
  document.getElementById('weakest-module-accuracy').innerText = minAccuracy <= 100 ? `${minAccuracy}% Accuracy` : '--% Accuracy';

  // Open Critical Defects List (Zoho Desk ticket links)
  const ticketsList = document.getElementById('critical-tickets-list');
  ticketsList.innerHTML = '';
  const criticalRows = filtered.filter(r => r['Defect Severity'] === 'Critical' || r['Defect Severity'] === 'High');
  
  // Extract unique defect rows based on ticket links
  const uniqueTickets = [];
  const seenUrls = new Set();
  criticalRows.forEach(r => {
    const url = r['Defect ID / Bug Ref Zoho Desk Ticketing'] ? r['Defect ID / Bug Ref Zoho Desk Ticketing'].trim() : '';
    if (url && url.startsWith('http') && !seenUrls.has(url)) {
      seenUrls.add(url);
      uniqueTickets.push({
        id: url.split('/').pop(),
        url: url,
        severity: r['Defect Severity'].toLowerCase()
      });
    }
  });

  if (uniqueTickets.length === 0) {
    ticketsList.innerHTML = '<li style="color: var(--text-secondary)">No active critical/high defects.</li>';
  } else {
    uniqueTickets.slice(0, 10).forEach(t => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${t.url}" target="_blank" class="ticket-link">Ticket #${t.id}</a>
        <span class="ticket-severity sev-${t.severity}">${t.severity}</span>
      `;
      ticketsList.appendChild(li);
    });
  }


  // 4. CHART RENDERING
  renderCharts(filtered);
}

// Render line and bar charts using Chart.js
function renderCharts(records) {
  // Aggregate by Date for Scores and Latency
  const dailyGroups = {};
  records.forEach(r => {
    const d = r['Test Date'] ? r['Test Date'].trim() : '';
    if (d && d !== 'NA' && d !== 'NIL') {
      if (!dailyGroups[d]) dailyGroups[d] = [];
      dailyGroups[d].push(r);
    }
  });

  const sortedDates = Object.keys(dailyGroups).sort();
  const trustData = [];
  const expData = [];
  const latencyData = [];

  sortedDates.forEach(d => {
    const rows = dailyGroups[d];
    const N = rows.length;
    
    // Trust
    const countSci = rows.filter(r => r['Answer Scientifically Correct?'] === 'Correct').length;
    const A_sci = percentage(countSci, N);
    const countMatch = rows.filter(r => r['WhatsApp vs Web Answer Match?'] === 'Yes').length;
    const C_chn = percentage(countMatch, N);
    const trust = Math.round((0.5 * A_sci) + (0.5 * C_chn)); // Simplified for daily graphing
    trustData.push(trust);

    // Experience
    const countSla = rows.filter(r => r['SLA Status'] === 'Within SLA').length;
    const S_sla = percentage(countSla, N);
    expData.push(S_sla);

    // Avg Latency (mins)
    let sumMin = 0;
    let countMin = 0;
    rows.forEach(r => {
      const m = timeToMinutes(r['Respo nse Time (mins) [Auto]']);
      if (m !== null) {
        sumMin += m;
        countMin++;
      }
    });
    latencyData.push(countMin ? sumMin / countMin : 0);
  });

  // Aggregate by Sprint for Defect Counts
  const sprintGroups = {};
  records.forEach(r => {
    const s = r['Sprint / Cycle'] ? r['Sprint / Cycle'].trim() : '';
    if (s && s !== 'NA' && s !== 'NIL') {
      if (!sprintGroups[s]) sprintGroups[s] = [];
      sprintGroups[s].push(r);
    }
  });

  const sortedSprints = Object.keys(sprintGroups).sort();
  const defectCounts = sortedSprints.map(s => {
    return sprintGroups[s].filter(r => r['Defect Severity'] === 'Critical' || r['Defect Severity'] === 'High').length;
  });

  // Score Chart
  if (chartScores) chartScores.destroy();
  const ctxScores = document.getElementById('chart-scores').getContext('2d');
  chartScores = new Chart(ctxScores, {
    type: 'line',
    data: {
      labels: sortedDates,
      datasets: [
        {
          label: 'Trust Score',
          data: trustData,
          borderColor: '#4f46e5',
          borderWidth: 1.5,
          tension: 0.1,
          pointRadius: 2
        },
        {
          label: 'Farmer Experience',
          data: expData,
          borderColor: '#10b981',
          borderWidth: 1.5,
          tension: 0.1,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 9 } } },
        y: { grid: { display: false }, min: 0, max: 100, ticks: { font: { family: 'Inter', size: 9 } } }
      },
      plugins: {
        legend: { labels: { font: { family: 'Inter', size: 10 } } }
      }
    }
  });

  // Latency Chart
  if (chartLatency) chartLatency.destroy();
  const ctxLatency = document.getElementById('chart-latency').getContext('2d');
  chartLatency = new Chart(ctxLatency, {
    type: 'line',
    data: {
      labels: sortedDates,
      datasets: [
        {
          label: 'Avg Response Time',
          data: latencyData,
          borderColor: '#f59e0b',
          borderWidth: 1.5,
          tension: 0.1,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 9 } } },
        y: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 9 } } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Defects Chart
  if (chartDefects) chartDefects.destroy();
  const ctxDefects = document.getElementById('chart-defects').getContext('2d');
  chartDefects = new Chart(ctxDefects, {
    type: 'bar',
    data: {
      labels: sortedSprints,
      datasets: [
        {
          label: 'Defect Volume',
          data: defectCounts,
          backgroundColor: '#ef4444',
          barThickness: 16
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 9 } } },
        y: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 9 } } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Handle CSV File Upload
document.getElementById('csv-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById('upload-status');
  statusEl.innerText = 'Uploading...';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      statusEl.innerText = 'Upload successful! Parsing new data...';
      fetchData();
    } else {
      statusEl.innerText = `Upload failed: ${result.error}`;
    }
  } catch (err) {
    console.error(err);
    statusEl.innerText = 'Error connecting during upload.';
  }
});

// Load data on startup
fetchData();
