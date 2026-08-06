# Privacy-Silhouette-Visualized

A lightweight Chrome Extension to scan local caches and cookies to visualize your current privacy standing.

---

## Scoring Formula Matrix

The privacy score is calculated out of a maximum ceiling of **100 points**:

$$\text{Final Score} = \max\left(0,\, 100 - \text{HistoryDeduction} - \text{CookieDeduction} - \text{TrackerDeduction}\right)$$

* **History Deduction:** $\min(25, \lfloor \text{HistoryItems} / 50 \rfloor)$
* **Cookie Deduction:** $\min(35, \lfloor \text{CookieCount} / 20 \rfloor)$
* **Tracker Deduction:** $\min(40, \text{TrackerMatches} \times 1.5)$

---

## Permission Justifications

This extension requires explicit Chrome permissions to perform local privacy auditing without transmitting data externally:

| Permission | Reason / Usage |
| --- | --- |
| `history` | Used to query local browsing paths over the past 7 days to count tracking endpoints. |
| `cookies` | Used to inspect active cookie jars across origin domains to measure persistent session decay. |
| `storage` | Used to persist custom tracker blocklists locally on the user's machine. |
| `<all_urls>` | Required to inspect cookie domain origins across third-party hosts. |

---

## Set-up Process

> **Note:** Please make sure you are using Google Chrome or a Chromium-based browser to run this tool.

1. **Clone or Download the Repository:**
   Clone this repository to your computer or download it as a `.zip` file and extract it.

2. **Verify Required Files:**
   Ensure the following essential extension files are inside your project folder:
   * `manifest.json`
   * `popup.html`
   * `popup.js`
   * `chart.js`
   * `icon.png`

3. **Load the Extension into Chrome:**
   * Open Chrome and navigate to `chrome://extensions/`.
   * Enable the **Developer Mode** toggle in the top-right corner.
   * Click the **Load unpacked** button in the top-left corner.
   * In the file explorer, select the project folder containing the files listed above.

4. **Run the Analyzer:**
   * Click the puzzle piece icon (Extensions menu) in the top-right toolbar of Chrome.
   * Pin and select **Local Privacy Score Analyzer** (or **Footprint**).
   * Click **Analyze Footprint** (or **Run Deep Analysis**).
   * View your footprint breakdown visualized in the interactive chart and detailed stats in the dropdown menu.