const DEFAULT_BLOCKLIST = [
  'doubleclick.net', 'google-analytics.com', 'analytics.', 
  'facebook.com/tr', 'scorecardresearch.com', 'adnxs.com', 
  'amazon-adsystem.com', 'hotjar.com', 'criteo.com'
];

document.addEventListener('DOMContentLoaded', async () => {
  const storage = await chrome.storage.local.get(['customBlocklist']);
  const list = storage.customBlocklist || DEFAULT_BLOCKLIST;
  document.getElementById('blocklistInput').value = list.join('\n');
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  const lines = document.getElementById('blocklistInput').value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  await chrome.storage.local.set({ customBlocklist: lines });
  
  const status = document.getElementById('status');
  status.textContent = 'Settings saved successfully!';
  setTimeout(() => status.textContent = '', 2000);
});