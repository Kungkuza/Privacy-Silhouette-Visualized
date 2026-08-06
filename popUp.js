// Default fallback list if user hasn't configured custom trackers
const DEFAULT_BLOCKLIST = [
  'doubleclick.net', 'google-analytics.com', 'analytics.', 
  'facebook.com/tr', 'scorecardresearch.com', 'adnxs.com', 
  'amazon-adsystem.com', 'hotjar.com', 'criteo.com'
];

document.getElementById('openOptions').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
  // 1. Fetch user-defined blocklist from storage or fallback to default
  const storage = await chrome.storage.local.get(['customBlocklist']);
  const trackerBlocklist = storage.customBlocklist || DEFAULT_BLOCKLIST;

  // 2. Query History & Cookies
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const historyItems = await chrome.history.search({ text: '', startTime: oneWeekAgo, maxResults: 5000 });
  const cookies = await chrome.cookies.getAll({});

  // 3. Count Tracker Matches in History
  let trackerMatches = 0;
  historyItems.forEach(item => {
    if (trackerBlocklist.some(domain => item.url.includes(domain))) {
      trackerMatches++;
    }
  });

  // 4. Update Counts in UI
  document.getElementById('historyCount').textContent = historyItems.length;
  document.getElementById('cookieCount').textContent = cookies.length;
  document.getElementById('trackerCount').textContent = trackerMatches;

  // 5. Calculate Score
  const baseScore = 100;
  const historyDeduction = Math.min(25, Math.floor(historyItems.length / 50));
  const cookieDeduction = Math.min(35, Math.floor(cookies.length / 20));
  const trackerDeduction = Math.min(40, trackerMatches * 1.5);

  const finalScore = Math.max(0, Math.round(baseScore - historyDeduction - cookieDeduction - trackerDeduction));

  // 6. Update Score UI & Colors
  const scoreDisplay = document.getElementById('scoreDisplay');
  scoreDisplay.textContent = finalScore;

  if (finalScore > 75) {
    scoreDisplay.style.color = '#2ecc71';
  } else if (finalScore > 40) {
    scoreDisplay.style.color = '#f1c40f';
  } else {
    scoreDisplay.style.color = '#e74c3c';
  }

  // 7. Dynamic Score Explanation & Guidance
  const explanationTitle = document.getElementById('explanationTitle');
  const explanationText = document.getElementById('explanationText');
  const remediationDetails = document.getElementById('remediationDetails');

  remediationDetails.style.display = 'block';

  if (finalScore <= 40) {
    explanationTitle.textContent = "High Privacy Risk detected";
    if (trackerMatches > 10) {
      explanationText.textContent = `Your score dropped mainly because ${trackerMatches} known tracking endpoints were detected in your recent browsing history.`;
    } else {
      explanationText.textContent = `Your score dropped primarily due to a high accumulation of ${cookies.length} stored cookies and ${historyItems.length} history records.`;
    }
  } else if (finalScore <= 75) {
    explanationTitle.textContent = "Moderate Privacy Footprint";
    explanationText.textContent = "Your local browser storage shows a moderate accumulation of session tracking data across routinely visited sites.";
  } else {
    explanationTitle.textContent = "Clean Privacy Footprint";
    explanationText.textContent = "Minimal tracking footprints detected in local storage. Your browser environment is currently well-maintained.";
  }
});