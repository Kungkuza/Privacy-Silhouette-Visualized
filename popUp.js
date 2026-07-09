document.getElementById('analyzeBtn').addEventListener('click', async () => {
  // 1. Fetch History (Looking at the last 7 days)
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const historyItems = await chrome.history.search({
    text: '',
    startTime: oneWeekAgo,
    maxResults: 5000
  });

  // 2. Fetch Cookies
  const cookies = await chrome.cookies.getAll({});

  // 3. Update Stats in UI
  document.getElementById('historyCount').textContent = historyItems.length;
  document.getElementById('cookieCount').textContent = cookies.length;

  // 4. Calculate the Privacy Score
  const baseScore = 100;
  
  // Logic: More history items and more cookies reduce your privacy score
  // You can heavily customize this algorithm later
  const historyDeduction = Math.min(30, Math.floor(historyItems.length / 50)); 
  const cookieDeduction = Math.min(40, Math.floor(cookies.length / 25));
  
  const finalScore = baseScore - historyDeduction - cookieDeduction;

  // 5. Visualize Score
  const scoreDisplay = document.getElementById('scoreDisplay');
  scoreDisplay.textContent = finalScore;

  // Dynamically change color based on score health
  if (finalScore > 75) {
    scoreDisplay.style.color = '#2ecc71'; // Green
  } else if (finalScore > 40) {
    scoreDisplay.style.color = '#f1c40f'; // Yellow
  } else {
    scoreDisplay.style.color = '#e74c3c'; // Red
  }
});