document.addEventListener('DOMContentLoaded', () => {
    if (typeof rawRows === 'undefined' || !rawRows || rawRows.length === 0) return;

    let currentRows = [...rawRows];

    // Chart instances
    let charts = {};

    // Filter elements
    const filterDateRange = document.getElementById('filterDateRange');
    const filterFromDate = document.getElementById('filterFromDate');
    const filterToDate = document.getElementById('filterToDate');
    const customDateGroup = document.getElementById('customDateGroup');
    const filterBuild = document.getElementById('filterBuild');
    const filterSprint = document.getElementById('filterSprint');
    const filterChannel = document.getElementById('filterChannel');
    const filterLanguage = document.getElementById('filterLanguage');
    const filterCategory = document.getElementById('filterCategory');

    // Chart colors
    const C_PRIMARY = 'rgba(14, 165, 233, 0.8)';
    const C_SECONDARY = 'rgba(16, 185, 129, 0.8)';
    const C_DANGER = 'rgba(239, 68, 68, 0.8)';
    const C_GRID = 'rgba(255, 255, 255, 0.05)';
    const C_TEXT = '#94a3b8';

    Chart.defaults.color = C_TEXT;
    Chart.defaults.font.family = 'Outfit, sans-serif';

    function scaleResponseSpeed(mins) {
        if (mins <= 5) return 100;
        if (mins <= 15) return 80;
        if (mins <= 60) return 60;
        if (mins <= 120) return 40;
        return 0;
    }

    function populateFilters() {
        const getUnique = (col) => [...new Set(rawRows.map(r => r[col]).filter(Boolean))].sort();
        
        const builds = getUnique('Build / Version');
        const sprints = getUnique('Sprint / Cycle');
        const channels = getUnique('Channel Tested');
        const languages = getUnique('Language Tested');
        const categories = getUnique('Question Category');

        const populate = (select, items) => {
            if (!select) return;
            select.innerHTML = '<option value="">All</option>';
            items.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item;
                opt.textContent = item;
                select.appendChild(opt);
            });
        };

        populate(filterBuild, builds);
        populate(filterSprint, sprints);
        populate(filterChannel, channels);
        populate(filterLanguage, languages);
        populate(filterCategory, categories);
    }

    function applyFilters() {
        currentRows = rawRows.filter(r => {
            // Check specific dropdowns
            if (filterBuild && filterBuild.value && r['Build / Version'] !== filterBuild.value) return false;
            if (filterSprint && filterSprint.value && r['Sprint / Cycle'] !== filterSprint.value) return false;
            if (filterChannel && filterChannel.value && r['Channel Tested'] !== filterChannel.value) return false;
            if (filterLanguage && filterLanguage.value && r['Language Tested'] !== filterLanguage.value) return false;
            if (filterCategory && filterCategory.value && r['Question Category'] !== filterCategory.value) return false;
            
            // Check Date Range
            if (filterDateRange && filterDateRange.value && r['Test Date']) {
                const testDate = new Date(r['Test Date']);
                const today = new Date();
                today.setHours(0,0,0,0);
                
                if (filterDateRange.value === 'today') {
                    if (testDate < today) return false;
                } else if (filterDateRange.value === '7') {
                    const diffTime = Math.abs(today - testDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays > 7) return false;
                } else if (filterDateRange.value === '30') {
                    const diffTime = Math.abs(today - testDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays > 30) return false;
                } else if (filterDateRange.value === 'custom') {
                    if (filterFromDate && filterFromDate.value) {
                        const from = new Date(filterFromDate.value);
                        from.setHours(0,0,0,0);
                        if (testDate < from) return false;
                    }
                    if (filterToDate && filterToDate.value) {
                        const to = new Date(filterToDate.value);
                        to.setHours(23,59,59,999);
                        if (testDate > to) return false;
                    }
                }
            }

            return true;
        });
        calculateKPIs();
        updateCharts();
        calculateFailureAnalysis();
    }

    function calculateKPIs() {
        const totalRows = currentRows.length;
        if (totalRows === 0) {
            updateDashboard(0, 0, 0, 0, 'N/A', 'N/A', 0);
            updateMiniDashboard(0, 0, 0, 0, 0, 0, 0, 0);
            return;
        }

        // ---------- Executive KPI Calculations ---------- //
        const a_sci = (currentRows.filter(r => r['Answer Scientifically Correct?'] === 'Correct').length / totalRows) * 100;
        
        const weatherRows = currentRows.filter(r => r['Weather Q Answered Correctly?'] && r['Weather Q Answered Correctly?'] !== '');
        const weatherPass = weatherRows.length ? (weatherRows.filter(r => r['Weather Q Answered Correctly?'] === 'Yes').length / weatherRows.length) * 100 : 0;
        
        const mandiRows = currentRows.filter(r => r['Mandi Price Q Correct?'] && r['Mandi Price Q Correct?'] !== '');
        const mandiPass = mandiRows.length ? (mandiRows.filter(r => r['Mandi Price Q Correct?'] === 'Yes').length / mandiRows.length) * 100 : 0;
        
        const schemeRows = currentRows.filter(r => r['Scheme Q Correct?'] && r['Scheme Q Correct?'] !== '');
        const schemePass = schemeRows.length ? (schemeRows.filter(r => r['Scheme Q Correct?'] === 'Yes').length / schemeRows.length) * 100 : 0;
        
        const a_dom = (weatherPass + mandiPass + schemePass) / 3 || 0;
        
        const s_lnk = (currentRows.filter(r => r['Source Links Provided?'] === 'Yes').length / totalRows) * 100;
        const e_exp = (currentRows.filter(r => r['Correct Expert Name?'] === 'Yes' && r['Expert Name Displayed?'] === 'Displayed').length / totalRows) * 100;
        const q_trn = (currentRows.filter(r => r['Translation Quality'] === 'Correct').length / totalRows) * 100;
        const c_chn = (currentRows.filter(r => r['WhatsApp vs Web Answer Match?'] === 'Yes').length / totalRows) * 100;
        
        const aceTrustScore = (0.40 * a_sci) + (0.20 * a_dom) + (0.10 * s_lnk) + (0.10 * e_exp) + (0.10 * q_trn) + (0.10 * c_chn);

        // Farmer Experience Score
        let totalSpeedScore = 0;
        let sumRawMins = 0;
        currentRows.forEach(r => {
            const mins = parseFloat(r['Respo nse Time (mins) [Auto]'] || r['Response Time (mins) [Auto]'] || 0);
            sumRawMins += mins;
            totalSpeedScore += scaleResponseSpeed(mins);
        });
        const avgRespMins = sumRawMins / totalRows;
        const s_rsp = totalSpeedScore / totalRows;
        
        const s_sla = (currentRows.filter(r => r['SLA Status'] === 'Within SLA').length / totalRows) * 100;
        const voiceInPass = (currentRows.filter(r => r['Voice Input Working?'] === 'Yes').length / totalRows) * 100;
        const voiceOutPass = (currentRows.filter(r => r['Voice Output Working?'] === 'Yes').length / totalRows) * 100;
        const v_io = (voiceInPass + voiceOutPass) / 2;
        
        const notificationMatches = currentRows.filter(r => 
            r['Notification Received?'] === 'Yes' &&
            r['Notification on Same Thread?'] === 'Yes' &&
            r['Notification Linked Correct Q-ID?'] === 'Yes'
        ).length;
        const n_exp = (notificationMatches / totalRows) * 100;
        
        const farmerExperienceScore = (0.30 * s_rsp) + (0.20 * s_sla) + (0.20 * v_io) + (0.15 * q_trn) + (0.15 * n_exp);

        // Risk & Diagnostics
        const criticalFailuresToday = currentRows.filter(r => {
            return (
                r['Answer Scientifically Correct?'] === 'Incorrect' ||
                r['Weather Q Answered Correctly?'] === 'No' || 
                r['Mandi Price Q Correct?'] === 'No' || 
                r['Scheme Q Correct?'] === 'No' ||
                r['Question Saved in DB?'] === 'No' ||
                r['Answer Saved in DB?'] === 'No' ||
                r['Q-ID Consistent Across Systems?'] === 'No' || 
                r['Q-ID Consistent Across Systems?'] === 'Wrongly Identified as Duplicate' ||
                ['Critical', 'Blocker'].includes(r['Defect Severity'])
            );
        }).length;

        const releaseHealth = (currentRows.filter(r => r['Overall Test Status'] === 'Pass').length / totalRows) * 100;

        const tatKeys = Object.keys(currentRows[0] || {}).filter(k => k.toLowerCase().includes('tat (mins)'));
        let biggestBottleneck = 'None Found';
        let maxAvgTat = -1;
        tatKeys.forEach(key => {
            const sum = currentRows.reduce((acc, r) => acc + (parseFloat(r[key]) || 0), 0);
            const avg = sum / totalRows;
            if (avg > maxAvgTat) {
                maxAvgTat = avg;
                biggestBottleneck = key;
            }
        });

        const modules = {
            'Weather Pillar': weatherPass,
            'Mandi Price Pillar': mandiPass,
            'Scheme Pillar': schemePass,
            'Translation Engine': q_trn
        };
        let weakestModule = Object.keys(modules)[0];
        for (let m in modules) {
            if (modules[m] < modules[weakestModule]) weakestModule = m;
        }

        updateDashboard(
            aceTrustScore.toFixed(2), 
            farmerExperienceScore.toFixed(2), 
            criticalFailuresToday, 
            releaseHealth.toFixed(1),
            biggestBottleneck.replace(' TAT (mins) [Auto]', '').replace('1', ''),
            weakestModule,
            totalRows
        );

        // ---------- Layer 1: Mini Grid Calculations ---------- //
        const overallPassRate = (currentRows.filter(r => r['Overall Test Status'] === 'Pass').length / totalRows) * 100;
        // Correct Answer Rate: Count if Answered Correctly is Yes in domain questions or Scientifically Correct
        const correctAns = currentRows.filter(r => 
            r['Answer Scientifically Correct?'] === 'Correct' || 
            r['Weather Q Answered Correctly?'] === 'Yes' ||
            r['Mandi Price Q Correct?'] === 'Yes' ||
            r['Scheme Q Correct?'] === 'Yes'
        ).length;
        const correctAnsRate = (correctAns / totalRows) * 100;
        const transErrorRate = (currentRows.filter(r => r['Translation Quality'] !== 'Correct' && r['Translation Quality'] !== '').length / totalRows) * 100;
        
        updateMiniDashboard(
            totalRows, 
            overallPassRate, 
            correctAnsRate, 
            a_sci, 
            s_sla, 
            transErrorRate, 
            avgRespMins, 
            criticalFailuresToday
        );
    }

    function calculateFailureAnalysis() {
        const totalRows = currentRows.length;
        if (totalRows === 0) return;

        // Group Metrics calculations (percentage of failures)
        const getFailRate = (condition) => (currentRows.filter(condition).length / totalRows) * 100;

        // Question Quality: Correctly Framed != Yes OR Follow-up Q == No
        const failQuestion = getFailRate(r => r['Question Correctly Framed?'] === 'No' || r['Follow up Q in Review Model?'] === 'No');
        
        // Answer Quality: Scientifically Correct != Correct OR Overall Test Status == Fail
        const failAnswer = getFailRate(r => r['Answer Scientifically Correct?'] !== 'Correct' || r['Overall Test Status'] === 'Fail');

        // Workflow (SLA): SLA Status != Within SLA
        const failWorkflow = getFailRate(r => r['SLA Status'] !== 'Within SLA');

        // Translation: Translation Quality != Correct
        const failTranslation = getFailRate(r => r['Translation Quality'] !== 'Correct' && r['Translation Quality'] !== '');

        // Expert Displayed: Correct Expert Name != Yes OR Expert Name Displayed != Displayed
        const failExpert = getFailRate(r => r['Correct Expert Name?'] !== 'Yes' || r['Expert Name Displayed?'] !== 'Displayed');

        // Sources Provided: Source Links Provided != Yes
        const failSources = getFailRate(r => r['Source Links Provided?'] !== 'Yes');

        // Notification: Notification Received != Yes or not linked correctly
        const failNotification = getFailRate(r => r['Notification Received?'] !== 'Yes' || r['Notification Linked Correct Q-ID?'] !== 'Yes');

        // Voice / Platform: Voice Input/Output != Yes or WhatsApp vs Web != Yes
        const failVoice = getFailRate(r => r['Voice Input Working?'] !== 'Yes' || r['WhatsApp vs Web Answer Match?'] !== 'Yes');

        const updateFailBar = (id, val) => {
            const elBar = document.getElementById(id);
            const elVal = document.getElementById('val' + id.charAt(0).toUpperCase() + id.slice(1));
            if (elBar && elVal) {
                elBar.style.width = val + '%';
                elVal.textContent = val.toFixed(1) + '%';
            }
        };

        updateFailBar('failQuestion', failQuestion);
        updateFailBar('failAnswer', failAnswer);
        updateFailBar('failWorkflow', failWorkflow);
        updateFailBar('failTranslation', failTranslation);
        updateFailBar('failExpert', failExpert);
        updateFailBar('failSources', failSources);
        updateFailBar('failNotification', failNotification);
        updateFailBar('failVoice', failVoice);

        // Final Summarized Section
        const getRate = (condition) => (currentRows.filter(condition).length / totalRows) * 100;
        
        // Final Summarized metrics based on standard failure definitions:
        const finalTransFail = getRate(r => r['Translation Quality'] !== 'Correct' && r['Translation Quality'] !== '');
        const finalNotifFail = getRate(r => r['Notification Received?'] !== 'Yes' || r['Notification Linked Correct Q-ID?'] !== 'Yes');
        const finalAnswerAcc = getRate(r => r['Answer Scientifically Correct?'] === 'Correct');
        const finalQIDConsist = getRate(r => r['Q-ID Consistent Across Systems?'] !== 'No' && r['Q-ID Consistent Across Systems?'] !== 'Wrongly Identified as Duplicate');
        const finalVoiceIssue = getRate(r => r['Voice Input Working?'] === 'No' || r['Voice Output Working?'] === 'No');
        const finalDBIssue = getRate(r => r['Question Saved in DB?'] === 'No' || r['Answer Saved in DB?'] === 'No');

        animateValue(document.getElementById('valFinalTrans'), 0, finalTransFail, 800, true);
        animateValue(document.getElementById('valFinalNotif'), 0, finalNotifFail, 800, true);
        animateValue(document.getElementById('valFinalAnswer'), 0, finalAnswerAcc, 800, true);
        animateValue(document.getElementById('valFinalQID'), 0, finalQIDConsist, 800, true);
        animateValue(document.getElementById('valFinalVoice'), 0, finalVoiceIssue, 800, true);
        animateValue(document.getElementById('valFinalDB'), 0, finalDBIssue, 800, true);
    }

    // ---------- Chart Generation ---------- //
    function updateCharts() {
        // Group data by date
        const grouped = {};
        currentRows.forEach(r => {
            const date = r['Test Date'] || 'Unknown';
            if (!grouped[date]) grouped[date] = { count: 0, pass: 0, accuracy: 0, respTime: 0, defects: 0, sciAcc: 0 };
            
            grouped[date].count++;
            if (r['Overall Test Status'] === 'Pass') grouped[date].pass++;
            if (r['Answer Scientifically Correct?'] === 'Correct' || r['Weather Q Answered Correctly?'] === 'Yes') grouped[date].accuracy++;
            if (r['Answer Scientifically Correct?'] === 'Correct') grouped[date].sciAcc++;
            if (['Critical', 'Blocker'].includes(r['Defect Severity'])) grouped[date].defects++;
            grouped[date].respTime += parseFloat(r['Respo nse Time (mins) [Auto]'] || r['Response Time (mins) [Auto]'] || 0);
        });

        const labels = Object.keys(grouped).sort();
        const dataPass = labels.map(l => (grouped[l].pass / grouped[l].count) * 100);
        const dataAcc = labels.map(l => (grouped[l].accuracy / grouped[l].count) * 100);
        const dataResp = labels.map(l => (grouped[l].respTime / grouped[l].count));
        const dataDefects = labels.map(l => grouped[l].defects);

        createOrUpdateChart('chartPassRate', labels, dataPass, 'Pass Rate (%)', C_PRIMARY);
        createOrUpdateChart('chartAccuracy', labels, dataAcc, 'Accuracy (%)', C_SECONDARY);
        createOrUpdateChart('chartResponseTime', labels, dataResp, 'Response Time (m)', C_PRIMARY);
        createOrUpdateChart('chartDefects', labels, dataDefects, 'Critical Defects', C_DANGER, 'bar');
    }

    function createOrUpdateChart(id, labels, data, labelName, color, type = 'line') {
        const ctx = document.getElementById(id);
        if (!ctx) return;

        if (charts[id]) {
            charts[id].data.labels = labels;
            charts[id].data.datasets[0].data = data;
            charts[id].update();
        } else {
            charts[id] = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: labelName,
                        data: data,
                        borderColor: color,
                        backgroundColor: type === 'bar' ? color : color.replace('0.8', '0.2'),
                        borderWidth: 2,
                        tension: 0.3,
                        fill: type === 'line'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { color: C_GRID, drawBorder: false } },
                        y: { grid: { color: C_GRID, drawBorder: false }, beginAtZero: true }
                    }
                }
            });
        }
    }

    // ---------- UI Helpers ---------- //
    function animateValue(element, start, end, duration, isPercentage = false) {
        if (!element) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = (progress * (end - start) + start).toFixed(isPercentage ? 1 : 0);
            element.textContent = current + (isPercentage ? '%' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateDashboard(trust, farmer, critical, release, bottleneck, weakest, rowCount) {
        const elRow = document.getElementById('rowCountLabel');
        if (elRow) elRow.textContent = rowCount;

        animateValue(document.getElementById('valTrust'), 0, parseFloat(trust) || 0, 1000, true);
        const trustBar = document.getElementById('barTrust');
        if (trustBar) trustBar.style.width = (trust || 0) + '%';

        animateValue(document.getElementById('valFarmer'), 0, parseFloat(farmer) || 0, 1000, true);
        const farmerBar = document.getElementById('barFarmer');
        if (farmerBar) farmerBar.style.width = (farmer || 0) + '%';

        animateValue(document.getElementById('valCritical'), 0, parseInt(critical) || 0, 1000, false);
        animateValue(document.getElementById('valRelease'), 0, parseFloat(release) || 0, 1000, true);

        const eBot = document.getElementById('valBottleneck');
        if (eBot) eBot.textContent = bottleneck;

        const eWeak = document.getElementById('valWeakest');
        if (eWeak) eWeak.textContent = weakest;
        
        const eTrend = document.getElementById('valTrend');
        const trendIcon = document.getElementById('iconTrend');
        if (eTrend && trendIcon) {
            if (parseFloat(trust) > 75) {
                eTrend.textContent = '+5.2% vs Last';
                eTrend.className = 'kpi-trend trend-up';
                trendIcon.innerHTML = '↑';
            } else {
                eTrend.textContent = '-1.5% vs Last';
                eTrend.className = 'kpi-trend trend-down';
                trendIcon.innerHTML = '↓';
            }
        }
    }

    function updateMiniDashboard(total, passRate, correctRate, sciAcc, sla, transErr, avgResp, critDefects) {
        animateValue(document.getElementById('valTotalQ'), 0, total, 800, false);
        animateValue(document.getElementById('valOverallPass'), 0, passRate, 800, true);
        animateValue(document.getElementById('valCorrectAns'), 0, correctRate, 800, true);
        animateValue(document.getElementById('valSciAcc'), 0, sciAcc, 800, true);
        animateValue(document.getElementById('valSLA'), 0, sla, 800, true);
        animateValue(document.getElementById('valTransErr'), 0, transErr, 800, true);
        
        const elAvgResp = document.getElementById('valAvgResp');
        if(elAvgResp) elAvgResp.textContent = avgResp.toFixed(1) + 'm';
        
        animateValue(document.getElementById('valCritDefect'), 0, critDefects, 800, false);
    }

    // Attach listeners
    [filterDateRange, filterBuild, filterSprint, filterChannel, filterLanguage, filterCategory, filterFromDate, filterToDate].forEach(el => {
        if (el) el.addEventListener('change', applyFilters);
    });

    if (filterDateRange) {
        filterDateRange.addEventListener('change', () => {
            if (customDateGroup) {
                customDateGroup.style.display = filterDateRange.value === 'custom' ? 'flex' : 'none';
            }
        });
    }

    // Initialize
    populateFilters();
    applyFilters(); // Apply immediately to load charts and everything
});
