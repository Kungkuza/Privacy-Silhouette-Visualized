# Privacy-Silhouette-Visualized
A tool to scan local caches and cookies to visualize your current privacy standing.

## Scoring Formula Matrix
The privacy score is calculated out of a maximum ceiling of **100 points**:

$$\text{Final Score} = \max\left(0,\, 100 - \text{HistoryDeduction} - \text{CookieDeduction} - \text{TrackerDeduction}\right)$$

* **History Deduction:** $\min(25, \lfloor \text{HistoryItems} / 50 \rfloor)$
* **Cookie Deduction:** $\min(35, \lfloor \text{CookieCount} / 20 \rfloor)$
* **Tracker Deduction:** $\min(40, \text{TrackerMatches} \times 1.5)$

## Permission Justifications
This extension requires explicit Chrome permissions to perform local privacy auditing without transmitting data externally:

## Permission | Reason / Usage

| `history` | Used to query local browsing paths over the past 7 days to count tracking endpoints. |
| `cookies` | Used to inspect active cookie jars across origin domains to measure persistent session decay. |
| `storage` | Used to persist custom tracker blocklists locally on the user's machine. |
| `<all_urls>` | Required to inspect cookie domain origins across third-party hosts. |