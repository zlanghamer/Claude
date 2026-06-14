# AI/Tech Institutional Accumulation Scanner — Setup Guide

This guide walks you through setting up the AI Accumulation Scanner on TradingView from scratch. No coding experience needed. Every step is spelled out.

---

## What This Scanner Does

It scores each stock from 0 to 6 based on six signals that, together, suggest large institutions may be quietly buying a stock before it makes a big move. When all six are active (score = 6), the stock is considered a high-probability accumulation candidate. A score of 5 or higher combined with a price breakout triggers the entry alert.

**The six signals:**
1. OBV Rising — volume is flowing in even while price stays flat
2. Price Consolidating — price is near its 6-month high but not breaking out yet
3. ATR Squeeze — volatility has contracted (the calm before the storm)
4. Structural Uptrend — the stock is above its 50-day and 200-day averages, both rising
5. Liquidity Floor — the stock trades enough daily dollar volume to be worth trading
6. Regime Filter — the Nasdaq (QQQ) is in an uptrend (no buying into a bear market)

---

## Section A: Loading the Pine Script

### Step 1 — Open Pine Editor

At the bottom of your TradingView chart, click the **Pine Editor** tab. If you don't see it, click the `{}` icon in the bottom toolbar.

### Step 2 — Paste the Code

1. Open the file `ai_accumulation_scanner.pine` in any text editor (Notepad works fine).
2. Select all the text (Ctrl+A), copy it (Ctrl+C).
3. Click inside the Pine Editor window and select all the existing placeholder text.
4. Paste your copied code (Ctrl+V).

### Step 3 — Save and Add to Chart

1. Click **Save** (the floppy disk icon, or Ctrl+S). Give it a name like "AI Accumulation Scanner."
2. Click **Add to chart** (the button to the right of Save).

> **Common mistake:** If you click "Add to chart" without saving first, TradingView may not retain your script name. Always save before adding.

### Step 4 — Confirm the Panes

After adding, you should see:
- Your **main price chart** (candlesticks) unchanged
- A **new sub-pane below** showing colored bars from 0 to 6 — this is the accumulation score

The score sub-pane colors mean:
- **Green bar** = Score 6 (all signals active — highest priority)
- **Orange bar** = Score 5
- **Yellow bar** = Score 3–4
- **Red bar** = Score 0–2

A green background on the chart (subtle shading) also appears when score hits 6.

### Step 5 — Review the Signal Table

In the top-right corner of the score pane, a small table shows each signal as ON or OFF for the current bar, plus a **Breakout Level** price. That price is the highest high over the last 20 bars — the level where a breakout entry would trigger.

### Step 6 — Adjust Inputs (Optional)

To change indicator settings:
1. Hover over the indicator name in the pane header.
2. Click the **gear icon** (⚙) that appears.
3. Adjust any input — lookback periods, ATR ratio, minimum dollar volume, etc.
4. Click OK.

Default settings are tuned for daily charts on liquid US tech stocks. Don't change them unless you have a specific reason.

---

## Section B: Building Your Watchlist

Create a dedicated watchlist called **"AI Accumulation Candidates"** so you can cycle through stocks efficiently.

### Step 1 — Create the Watchlist

1. In the left panel, click the **Watchlist** icon (the list icon).
2. Click the **+** or the three-dot menu at the top of your watchlist panel.
3. Select **New list** and name it "AI Accumulation Candidates."

### Step 2 — Add Seed Tickers

Start with these three groups. Add them all — you'll naturally drop the ones that stop showing signals over time.

**AI Infrastructure (Hardware):**
NVDA, AMD, AVGO, MRVL, ANET, SMCI, COHR, KLAC, LRCX, AMAT, MU, TSM, ARM

**AI Software & Cloud:**
MSFT, GOOGL, META, CRM, SNOW, PLTR, NET, DDOG, MDB, MNDY, HUBS, NOW, WDAY

**Semiconductor ETFs (for macro context):**
SMH, SOXX, SOXL

> **Tip:** You can color-code sections in TradingView watchlists by right-clicking a symbol and choosing a label color. Use one color for hardware, another for software — makes scanning faster.

### Step 3 — Cycle Through Symbols

To scan the list:
1. Click the first symbol in your watchlist.
2. Press the **down arrow key** to move to the next symbol.
3. Glance at the score sub-pane. If it shows green or orange bars recently, look closer.
4. Move on. The entire list takes about 10 minutes once you're practiced.

---

## Section C: Setting Up Alerts

Alerts let TradingView notify you automatically — so you don't have to watch the screen all day.

> **Important limitation:** TradingView alerts are per-symbol. You must set up an alert for each individual stock you want to monitor. There is no "scan all watchlist" alert in Pine Script — that would require TradingView's Screener product (not covered here).

### Step 1 — Load the Symbol You Want to Alert On

Click the symbol in your watchlist (e.g., NVDA). Make sure the AI Accumulation Scanner is visible in the sub-pane.

### Step 2 — Open the Alert Dialog

Right-click anywhere on the chart and select **Add Alert**, or press **Alt+A**.

### Step 3 — Configure the Alert

In the alert dialog:

| Field | What to Set |
|-------|-------------|
| **Condition** | Select "AI Accumulation Scanner" from the first dropdown |
| **Alert name** | Second dropdown: choose one of the two alert conditions (see below) |
| **Frequency** | Set to "Once Per Bar Close" |
| **Expiration** | Set to Open-ended or 1 month — your preference |
| **Notification** | Enable popup, email, or mobile push — whatever you check regularly |

### The Two Alert Conditions

**"[AI Accum] Score Reached 6 — Entry Watch"**
- Fires when score hits 6 for the first time (was lower the bar before)
- Meaning: all six signals just aligned — put this stock on your radar
- Action: add to your watchlist shortlist, zoom in, wait for breakout

**"[AI Accum] Breakout Trigger — Score ≥ 5"**
- Fires when price closes above the 20-bar consolidation high AND score is 5 or 6
- Meaning: price is breaking out of its accumulation range with institutional backing
- Action: this is your actual entry signal (see Section E)

> **Which to use?** Set both. The "Score 6" alert is the early warning. The "Breakout Trigger" is the trade signal. You want both — the first tells you to watch, the second tells you to act.

### Step 4 — Repeat Per Symbol

Do Steps 1–3 for each symbol on your watchlist you want covered. Prioritize the stocks that are already showing score 4–5 — they're closest to triggering.

---

## Section D: Daily Workflow (10 Minutes, End of Day)

Run this after US market close (4:00–4:30 PM ET). Use the daily timeframe (1D chart).

1. **Open your AI Accumulation Candidates watchlist.**
2. **Cycle through each symbol** using the down arrow key.
3. **For each symbol, check:**
   - Is the current score 5 or 6? (green/orange bar today)
   - Is the score rising? (bars getting taller over recent days)
   - Is the Breakout Level (shown in the table) close to current price?
4. **Flag your top 3–5 candidates** — these are stocks with score ≥ 4 and price within 3–5% of the Breakout Level.
5. **Set or verify alerts** on flagged candidates if not already set.
6. **Log flagged candidates** in your tracking spreadsheet (see Section F).

That's it. Ten minutes. You are not making trade decisions during this scan — you are just identifying candidates to watch. Decisions happen when an alert fires.

---

## Section E: Execution Rules

### Entry Method A — Breakout Entry (Preferred)

**Trigger:** Alert fires: "Breakout Trigger — Score ≥ 5"

**Entry:** Buy on the next open after the daily close that triggered the alert, OR buy intraday if you're watching and price holds above the breakout level for 15+ minutes with volume.

**Stop Loss:** Place stop below the most recent swing low, OR use 2× the 14-day ATR below your entry price — whichever is tighter.

> **ATR (Average True Range)** = a measure of how much a stock typically moves in a day. If ATR is $4 and you enter at $100, a 2× ATR stop is at $92.

**Target:** No fixed target. Trail your stop as price moves up. Consider taking partial profits at 1:2 risk/reward (risk $4, take some off at +$8 gain).

---

### Entry Method B — Pullback Entry (More Patient)

**Setup:** Stock had score 6, then broke out. Price pulls back to the breakout level (old resistance becomes new support).

**Entry:** Buy when price touches or comes within 1% of the former Breakout Level and holds (doesn't close below it on daily chart).

**Stop Loss:** Daily close below the Breakout Level = exit immediately. No exceptions.

**Why this works:** Institutions that accumulated the stock rarely let it fall back below the breakout point. If it does, the thesis is broken — exit.

---

### Position Sizing

Size each position so that if your stop is hit, you lose no more than 1–2% of your total account.

**Formula:** `Position Size = (Account × Risk%) ÷ (Entry Price − Stop Price)`

**Example:** $50,000 account, 1% risk = $500 max loss. Entry $100, stop $94 = $6 risk per share. Position size = $500 ÷ $6 = 83 shares.

---

### Invalidation Conditions

Exit or do not enter if any of these occur:

- Score drops back to 0–2 before breakout happens (thesis reset)
- Regime Filter turns off (QQQ drops below its 50-day SMA) — this is a market-wide risk-off signal
- Earnings are within 5 trading days — earnings can destroy the setup regardless of score
- Stock gaps down more than 5% on heavy volume before your entry

---

## Section F: Tracking Spreadsheet

Use a simple spreadsheet with these columns to track all candidates and trades:

| Column | What to Enter |
|--------|---------------|
| **Date Flagged** | When you first noticed score ≥ 5 |
| **Symbol** | Ticker |
| **Score** | Current score when flagged (5 or 6) |
| **Breakout Level** | Price shown in the signal table |
| **Distance to Breakout** | ((Breakout Level − Current Price) / Current Price) × 100% |
| **Alert Set?** | Yes / No |
| **Entry Date** | When you actually entered |
| **Entry Price** | Your fill price |
| **Stop Price** | Your stop level |
| **Target Price** | Your 1:2 R target (optional) |
| **Exit Date** | When you closed |
| **Exit Price** | Your fill price |
| **Result $** | Profit or loss in dollars |
| **Notes** | Why you took it, what happened |

Review this monthly. Look for patterns: which signal combinations lead to the best outcomes, which sectors are working, what you're getting wrong.

---

## Known Limitations

Be aware of these before trading:

1. **Dark pool blind spot.** This scanner uses exchange-reported volume only. A significant portion of institutional buying happens in dark pools (private exchanges) and is not captured by OBV. A high score is a signal, not a guarantee.

2. **Free TradingView tier limits.** Free accounts can only have 1–3 active alerts at a time. To monitor a full watchlist, you need a paid plan (Essential or higher). Check TradingView's current pricing — it changes.

3. **No backtesting.** This is an `indicator()`, not a `strategy()`. TradingView cannot automatically calculate historical win rates for you. You would need to manually scroll back through charts and count setups to estimate performance.

4. **Binary regime filter.** The QQQ filter is either fully on or fully off. In choppy markets where QQQ is just above or below its 50-day SMA, signals may flicker on and off frequently. During these periods, raise your score threshold — only act on confirmed score 6 with a clear breakout.

5. **No fundamental overlay.** This scanner is purely technical. It cannot know if a company is about to report bad earnings, lose a major customer, or face regulatory action. Always check upcoming earnings dates before entering a trade. A technically perfect setup ahead of a bad earnings report is a trap.

---

## Quick Reference Card

| Score | Meaning | Action |
|-------|---------|--------|
| 6 | All signals aligned | Alert watch mode — look for breakout |
| 5 | Strong setup | Alert watch mode — breakout alert active |
| 3–4 | Building | Monitor, do not act yet |
| 0–2 | No edge | Ignore, move on |

**Entry:** Breakout above 20-bar high with score ≥ 5
**Stop:** 2× ATR below entry OR below recent swing low
**Exit:** Stop hit OR regime filter turns off OR score collapses before entry
