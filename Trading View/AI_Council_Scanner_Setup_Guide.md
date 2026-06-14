# AI Council Scanner — Setup Guide

This guide sets up the **AI Council Scanner** on TradingView. It takes the council's fundamental verdict on 12 AI names (from `ai_council_v3_better_metrics.md`) and fuses it with live technical confirmation, so you only act when a *fundamentally-ranked* name *also* breaks out technically. No coding needed. Matches the format of your AI Accumulation Scanner guide.

---

## ⚠️ How this gets onto your machine (read first)
This was built in the **online ClaudeVault** (cloud). It **cannot write to `D:\Obsidian\My Vault\Trading View` directly** — a remote session can't reach your home PC, and a TradingView MCP running on your PC isn't connected to this session. The files live in the repo at `market-data/event-alerts/`:
- `ai_council_scanner.pine`
- `AI_Council_Scanner_Setup_Guide.md` (this file)

**To use them:** pull/sync ClaudeVault to your PC (however your vault syncs), then copy these two files into `D:\Obsidian\My Vault\Trading View`. Then follow Section A. (TradingView itself has no API to import scripts/alerts — pasting the .pine is the only path, same as your accumulation scanner.)

---

## What This Scanner Does

It scores each stock **0 to 6** = **Fundamental base (0–2)** + **Technical confirmation (0–4)**. The fundamental base is the council's verdict, embedded per-symbol; the technical part is computed live. A rated quality name that also confirms technically scores high; a flagged "caution" name is capped low even on a breakout (so you don't chase the names where price is already ahead of fundamentals).

**Fundamental base (0–2), embedded from the council's 12-month ranking:**
- **2** = TOP-tier quality long (AVGO, NVDA, TSM, ANET, GOOGL)
- **1** = CYCLICAL wildcard (MU), QUALITY-RICH (CRWD), or MID (MKSI)
- **0** = CAUTION — priced ahead of fundamentals (MRVL, CRDO, COHR, NBIS)

**Technical confirmation (0–4), live each bar:**
1. **Structural uptrend** — above rising 50-day and above 200-day
2. **Near/at breakout** — within the proximity band of the 20-bar high
3. **Regime filter** — QQQ above its 50-day (no buying into a Nasdaq downtrend)
4. **Momentum** — price above its level 20 bars ago

A green background appears when score hits 6. The score sub-pane colors: **green=6, orange=5, yellow=3–4, red=0–2** (same scheme as your accumulation scanner).

---

## Section A: Loading the Pine Script

### Step 1 — Open Pine Editor
At the bottom of your chart, click the **Pine Editor** tab (or the `{}` icon).

### Step 2 — Paste the Code
1. Open `ai_council_scanner.pine` in any text editor; Select All (Ctrl+A), Copy (Ctrl+C).
2. Click inside the Pine Editor, select the placeholder text, Paste (Ctrl+V).

### Step 3 — Save and Add to Chart
1. **Save** (Ctrl+S) → name it "AI Council Scanner."
2. Click **Add to chart**. (Save before adding, or the name may not stick.)

### Step 4 — Confirm the Panes
- Main price chart unchanged.
- A **new sub-pane** showing the 0–6 score as colored columns.

### Step 5 — Review the Signal Table
Top-right of the score pane: the symbol + its **council rank**, the **fundamental tier**, each of the 4 technical signals ON/OFF, the **Breakout Level** (20-bar high), a **Flag** (e.g. "quality long" vs "PRICED AHEAD — fade/verify"), and the **as-of date**.

### Step 6 — Adjust Inputs (Optional)
Gear icon (⚙) on the indicator → tune breakout lookback, proximity band, momentum lookback, tripwire %, or regime symbol. Defaults are for daily charts on liquid US tech.

---

## Section B: Building Your Watchlist
Import `tradingview_council_watchlist.txt` (Watchlist panel → ··· → Import list), or create **"AI Council"** manually with these, grouped by tier:

**Top-tier quality longs:** AVGO, NVDA, TSM, ANET, GOOGL
**Cyclical wildcard (binary on MU earnings Jun 24):** MU
**Quality but expensive:** CRWD
**Caution — priced ahead of fundamentals:** MRVL, CRDO, COHR, NBIS
**Mid:** MKSI

> Color-code by tier (right-click symbol → label color) so the caution names are visually distinct.

---

## Section C: Setting Up Alerts
Per-symbol (TradingView alerts can't scan a whole list). Load the symbol, Alt+A, Condition = **AI Council Scanner**, then pick a condition below. Frequency **Once Per Bar Close**, daily timeframe.

**"Council Conviction Breakout"** — fires when a *rated, non-caution* name breaks its 20-bar high with the Nasdaq in an uptrend. **This is the trade signal** (Section E). Set it on the top-tier names + MU/CRWD/MKSI.

**"Council Top-Tier Setup (score 5–6)"** — early warning that a top-tier name is aligning. Set on AVGO/NVDA/TSM/ANET/GOOGL.

**"Council Thesis Tripwire"** — fires on a big daily move (set the input: MU 6%, CRWD 8%, NBIS 10%). Proxy for an earnings/financing event landing — re-check `ai_tripwires.md`. Do NOT set conviction-breakout alerts on the CAUTION names; use only the tripwire there.

---

## Section D: Daily Workflow (10 Minutes, End of Day)
1. Open the **AI Council** watchlist on the 1D chart.
2. Cycle symbols with the down-arrow key.
3. For each: is score 5–6 (green/orange)? Is the fundamental tier TOP? Is price near the Breakout Level?
4. Flag top candidates = **TOP-tier AND score ≥ 5 AND within ~3–5% of breakout**.
5. Verify the conviction-breakout alert is set on flagged names.
6. Log them (Section F).

You're identifying candidates, not deciding trades — decisions happen when an alert fires.

---

## Section E: Execution Rules
**Only take conviction breakouts on rated, non-CAUTION names.** A CAUTION name (score capped ≤4) breaking out is exactly the "priced ahead of fundamentals" trap — skip or demand independent confirmation.

- **Entry:** on the "Conviction Breakout" alert — next open, or intraday if price holds above the breakout level 15+ min on volume.
- **Stop:** below recent swing low, or 2× 14-day ATR below entry — whichever is tighter.
- **Sizing:** risk ≤1–2% of account per trade. `Shares = (Account × Risk%) ÷ (Entry − Stop)`.
- **Invalidation / don't enter if:** score drops to 0–2 before breakout; regime filter turns off (QQQ < 50-day); **earnings within 5 trading days** (esp. MU around Jun 24 — let the print clear); gap down >5% on volume.

---

## Section F: Tracking Spreadsheet
| Column | Enter |
|---|---|
| Date Flagged | when score ≥ 5 first seen |
| Symbol / Council Rank / Tier | ticker, 12mo rank, tier |
| Score | 5 or 6 |
| Breakout Level | from the table |
| Distance to Breakout | ((level − price)/price)×100% |
| Alert Set? | Y/N |
| Entry / Stop / Target | your levels |
| Exit / Result $ | outcome |
| Notes | thesis + what happened |

---

## Known Limitations
1. **The fundamental base is a hardcoded 2026-06-14 snapshot.** It does NOT update itself. After earnings, re-run `scripts/bullish_screen.py`, then edit the `tier`/`rk12`/`fbase` arrays at the top of the .pine. **A stale fundamental base is the main risk** — a name's tier can change.
2. **No MCP / no auto-push.** TradingView has no inbound API; this can't be installed programmatically. Paste/import only.
3. **Per-symbol alerts.** A full-watchlist scan-alert needs TradingView's Screener, not Pine. Free tier caps active alerts (1–3); a paid plan is needed for the whole list.
4. **Technical signals are lagging/binary.** The regime filter flickers when QQQ hugs its 50-day; in chop, demand a clean score 6.
5. **Fundamentals are real-world as of the build date; the council's price-momentum work used a simulated price base.** Trust the fundamental tiers; treat exact ranks as directional.
6. **Earnings blind spot.** The scanner doesn't know earnings dates — always check before entering (Section E).

---

## Quick Reference Card
| Score | Meaning | Action |
|---|---|---|
| 6 | Top fundamentals + full technical confirmation | Conviction breakout — act per Section E |
| 5 | Strong | Watch; breakout alert active |
| 3–4 | Building, or a caution-name breaking out | Monitor; do not chase caution names |
| 0–2 | No edge | Ignore |

**Trade only:** rated, non-CAUTION name + fresh 20-bar-high breakout + QQQ uptrend.
**Stop:** 2× ATR or swing low. **Skip:** earnings within 5 days; CAUTION-tier breakouts.
**Refresh the fundamental base after each earnings season.**
