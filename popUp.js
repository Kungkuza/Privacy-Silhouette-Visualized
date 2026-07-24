let privacyChart = null;

const TRACKER_BLOCKLIST = [
  'doubleclick.net', 'google-analytics.com', 'analytics.', 
  'facebook.com/tr', 'scorecardresearch.com', 'adnxs.com', 
  'amazon-adsystem.com', 'hotjar.com'
];

// Toggle Detail Panel Logic
document.getElementById('toggleDetailsBtn').addEventListener('click', (e) => {
  const panel = document.getElementById('detailsPanel');
  if (panel.style.display === 'block') {
    panel.style.display = 'none';
    e.target.textContent = '▶ View Raw Vulnerability Data';
  } else {
    panel.style.display = 'block';
    e.target.textContent = '▼ Hide Raw Vulnerability Data';
  }
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const historyItems = await chrome.history.search({ text: '', startTime: oneWeekAgo, maxResults: 10000 });
  const allCookies = await chrome.cookies.getAll({});

  let trackerHistoryCount = 0;
  let standardHistoryCount = 0;
  let thirdPartyCookies = 0;
  let firstPartyCookies = 0;

  historyItems.forEach(item => {
    const url = item.url.toLowerCase();
    if (TRACKER_BLOCKLIST.some(domain => url.includes(domain))) {
      trackerHistoryCount++;
    } else {
      standardHistoryCount++;
    }
  });

  allCookies.forEach(cookie => {
    if (cookie.sameSite === 'no_restriction' || cookie.domain.startsWith('.')) {
      thirdPartyCookies++;
    } else {
      firstPartyCookies++;
    }
  });

  // Math Deductions
  let score = 100;
  score -= (standardHistoryCount * 0.01 + trackerHistoryCount * 1.5 + firstPartyCookies * 0.05 + thirdPartyCookies * 0.4);
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Populate UI Text Elements
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('rawSafeHist').textContent = standardHistoryCount;
  document.getElementById('rawTrackHist').textContent = trackerHistoryCount;
  document.getElementById('rawFirstParty').textContent = firstPartyCookies;
  document.getElementById('rawThirdParty').textContent = thirdPartyCookies;

  const scoreDisplay = document.getElementById('scoreDisplay');
  const scoreLabel = document.getElementById('scoreLabel');
  if (score > 75) {
    scoreDisplay.style.color = '#2ecc71'; scoreLabel.textContent = "Excellent: Minimal Footprint"; scoreLabel.style.color = '#2ecc71';
  } else if (score > 40) {
    scoreDisplay.style.color = '#f1c40f'; scoreLabel.textContent = "Warning: Moderate Exposure"; scoreLabel.style.color = '#f1c40f';
  } else {
    scoreDisplay.style.color = '#e74c3c'; scoreLabel.textContent = "Critical Risk: High Vulnerability"; scoreLabel.style.color = '#e74c3c';
  }

  // Render Chart
  if (privacyChart) { privacyChart.destroy(); }
  const ctx = document.getElementById('privacyChart').getContext('2d');
  privacyChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Safe History', 'Tracker Links', '1st Party', '3rd Party'],
      datasets: [{
        data: [standardHistoryCount, trackerHistoryCount, firstPartyCookies, thirdPartyCookies],
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#e67e22'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } } }
    }
  });
});