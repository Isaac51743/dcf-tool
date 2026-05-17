# Domi DCF Valuation Tool

A pure frontend Discounted Cash Flow (DCF) valuation tool built with TypeScript. No backend — all data is stored in the browser's `localStorage`.

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | ≥ 18.x | Runtime & package manager |
| **npm** | ≥ 9.x | Dependency management (bundled with Node.js) |
| **TypeScript** | ^5.4.0 | Compiler (installed as dev dependency) |
| **Modern Browser** | Chrome / Edge / Firefox | ES2020 module support required |

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Isaac51743/dcf-tool.git
cd dcf-tool

# 2. Install dependencies
npm install

# 3. Build TypeScript → JavaScript
npm run build          # one-time build
# or
npm run watch          # auto-rebuild on file changes

# 4. Start the local server
npx serve -l 3000

# 5. Open in browser
# http://localhost:3000
```

---

## Project Structure

```
dcf-tool/
├── index.html          # Homepage — model list
├── model.html          # Model editor page
├── styles.css          # Global styles (black + green theme)
├── serve.json          # serve config (clean URLs)
├── tsconfig.json       # TypeScript config (ES2020, strict)
├── package.json
└── src/
    ├── types.ts        # All type definitions
    ├── calc.ts         # Core calculation engine (WACC, DCF, Sensitivity)
    ├── storage.ts      # localStorage CRUD + schema migration
    ├── model.ts        # Model editor UI controller
    └── main.ts         # Homepage UI controller
```

---

## Valuation Methodology

The tool implements a standard **2-stage DCF (Discounted Cash Flow)** model, split into two main areas: **WACC Calculation** and **DCF Valuation**.

### Area 1: WACC (Weighted Average Cost of Capital)

WACC is calculated as a **reference** value. The actual discounting uses a user-defined **Expected Discount Rate**.

#### Step 1 — Raw Financial Inputs

| Input | Unit | Source |
|-------|------|--------|
| Market Cap | $B | Market data |
| Total Debt | $B | Balance sheet |
| Interest Expense | $B | Income statement |
| Pre-tax Income | $B | Income statement |
| Tax Provision | $B | Income statement |
| Beta (β) | — | Market data (5Y monthly) |
| Risk-Free Rate (Rf) | % | 10-Year Treasury yield |
| Expected Market Return (Rm) | % | Long-term market average |

#### Step 2 — Derived Results

All intermediate values are auto-calculated:

```
Equity Risk Premium (ERP) = Rm − Rf
Cost of Equity (Ke)       = Rf + β × ERP                    ← CAPM
Cost of Debt (Kd)         = Interest Expense / Total Debt
Effective Tax Rate        = Tax Provision / Pre-tax Income
After-tax Cost of Debt    = Kd × (1 − Tax Rate)
Weight of Equity (We)     = Market Cap / (Market Cap + Total Debt)
Weight of Debt (Wd)       = Total Debt / (Market Cap + Total Debt)

WACC = We × Ke + Wd × Kd × (1 − Tax Rate)
```

---

### Area 2: DCF Valuation

#### Step 1 — Enterprise Value (EV)

**Inputs:**

| Input | Unit | Description |
|-------|------|-------------|
| Base Revenue (TTM) | $B | Starting revenue for projections |
| Revenue Growth Rates | % per year | Independent growth rate for each of the N projection years |
| Expected Discount Rate | % | Used for discounting (independent of WACC) |
| Terminal Growth Rate | % | Perpetual growth rate after projection period |
| EBIT Margin | % per year | Operating margin assumption per year |
| Tax Rate for FCF | % per year | Tax rate applied to EBIT per year |
| D&A % of Revenue | % per year | Depreciation & Amortization as % of revenue |
| CapEx % of Revenue | % per year | Capital Expenditures as % of revenue |
| ΔNWC % of Revenue | % per year | Change in Net Working Capital as % of revenue |
| Historical Growth Rates | % × 5 years | Past 5 years individual growth rates (reference only) |

**Calculation — For each projection year `i` (1 to N):**

```
Revenue(i)  = Revenue(i−1) × (1 + Growth Rate(i))
EBIT(i)     = Revenue(i) × EBIT Margin(i)
NOPAT(i)    = EBIT(i) × (1 − Tax Rate(i))          ← Net Operating Profit After Tax
D&A(i)      = Revenue(i) × D&A %(i)
CapEx(i)    = Revenue(i) × CapEx %(i)
ΔNWC(i)     = Revenue(i) × ΔNWC %(i)

FCF(i)      = NOPAT(i) + D&A(i) − CapEx(i) − ΔNWC(i)    ← Free Cash Flow

Discount Factor(i) = 1 / (1 + DR)^i
PV of FCF(i)       = FCF(i) × Discount Factor(i)
```

**Terminal Value (Gordon Growth Model):**

```
Terminal Value = FCF(N) × (1 + Terminal Growth Rate) / (DR − Terminal Growth Rate)
PV of TV       = Terminal Value / (1 + DR)^N
```

**Enterprise Value:**

```
EV = Σ PV of FCF(1..N) + PV of Terminal Value
```

#### Step 2 — Equity Bridge → Fair Value

```
Equity Value     = EV + Cash & Investments + Other Investments − Total Debt
Fair Value/Share  = Equity Value / Shares Outstanding
Margin of Safety = (Fair Value − Current Price) / |Fair Value| × 100%
```

---

### Sensitivity Analysis

A 5×5 matrix varying **Discount Rate** (±1.0% in 0.5% steps) against **Terminal Growth Rate** (±1.0% in 0.5% steps), showing Fair Value per Share for each combination.

---

## Features

- **Per-year precision assumptions** — Independent EBIT Margin, Tax Rate, D&A%, CapEx%, ΔNWC% for every projection year
- **20-year projection support** — Long-term models for high-growth companies
- **Sensitivity analysis** — 5×5 Discount Rate vs Terminal Growth matrix
- **Chart.js visualizations** — FCF bar chart & EV composition doughnut
- **Collapsible UI** — Organized sections with expand/collapse
- **Chinese help modals** — Click (?) for variable explanations in Chinese
- **Full abbreviation tooltips** — Hover over any abbreviation (EBIT, NOPAT, D&A, etc.) for full name
- **Input validation** — Warnings for invalid or unusual inputs
- **Schema migration** — Automatic migration when data model evolves
- **XSS protection** — All user inputs are sanitized
- **localStorage persistence** — No server or database needed

---

## Data Sources

For filling in model parameters, recommended sources:

| Data | Source |
|------|--------|
| Revenue, EBIT, Net Income, D&A, CapEx | Annual reports / 10-K filings |
| Market Cap, Beta, Stock Price | Yahoo Finance, Google Finance |
| Interest Expense, Tax Provision, Total Debt | Income statement & balance sheet |
| Risk-Free Rate | U.S. 10-Year Treasury yield |
| Expected Market Return | Historical S&P 500 average (~10%) |
| Cash & Investments, Shares Outstanding | Balance sheet |

---

## License

MIT
