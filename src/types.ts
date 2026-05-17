// ========== Type Definitions ==========

export interface WACCParams {
  // Raw financial data inputs
  marketCap: number;           // Market capitalization (M)
  totalDebt: number;           // Total debt (M)
  interestExpense: number;     // Annual interest expense (M)
  preTaxIncome: number;        // Pre-tax income (M)
  taxProvision: number;        // Income tax provision (M)
  beta: number;                // Beta coefficient
  riskFreeRate: number;        // Treasury bond rate (%)
  expectedMarketReturn: number; // Expected market return (%)
}

export interface DCFParams {
  // Step 1: FCF Projection → EV
  baseRevenue: number;           // $B
  revenueGrowthRates: number[];  // % per year (future)
  historicalGrowthRates: number[]; // % per year (past 5Y, reference only)
  expectedDiscountRate: number;  // % (期望折现率 / 期望收益率, used for discounting)
  ebitMargins: number[];         // % per year
  taxRatesForFCF: number[];     // % per year
  daPercents: number[];          // % of revenue per year
  capexPercents: number[];       // % of revenue per year
  nwcChangePercents: number[];   // % of revenue per year
  terminalGrowthRate: number;    // %

  // Step 2: EV → Equity Value → Fair Value
  cashAndInvestments: number;    // $B (Cash & Short-term Investments)
  otherInvestments: number;      // $B (Other long-term investments)
  totalDebt: number;             // $B
  sharesOutstanding: number;     // B (billion shares)
  currentPrice: number;          // $ per share
}

export interface DCFModel {
  id: string;
  name: string;
  years: 10 | 20;
  createdAt: string;
  updatedAt: string;
  wacc: WACCParams;
  dcf: DCFParams;
}

// ========== Sensitivity ==========

export interface SensitivityResult {
  waccRates: number[];
  terminalGrowthRates: number[];
  fairValues: number[][]; // [wacc_idx][tg_idx]
}

// ========== Validation ==========

export interface ValidationWarning {
  field: string;
  message: string;
}

// ========== Computed Results ==========

export interface WACCResult {
  weightEquity: number;      // E/(D+E) as %
  weightDebt: number;        // D/(D+E) as %
  costOfEquity: number;      // CAPM: Rf + β(Rm - Rf) as %
  costOfDebt: number;        // Interest / Total Debt as %
  marketRiskPremium: number; // Rm - Rf as %
  effectiveTaxRate: number;  // Tax Provision / Pre-tax Income as %
  afterTaxCostOfDebt: number; // Kd × (1 - t) as %
  wacc: number;              // We×Ke + Wd×Kd×(1-t) as %
}

export interface YearProjection {
  year: number;
  revenue: number;
  growthRate: number;
  ebit: number;
  nopat: number;
  da: number;
  capex: number;
  nwcChange: number;
  fcf: number;
  discountFactor: number;
  pvFCF: number;
}

export interface DCFResult {
  projections: YearProjection[];
  terminalValue: number;
  pvTerminalValue: number;
  sumPvFCF: number;
  enterpriseValue: number;
  // EV → Equity Bridge
  cashAndInvestments: number;
  otherInvestments: number;
  totalDebt: number;
  equityValue: number;
  fairValuePerShare: number;
  currentPrice: number;
  marginOfSafety: number; // %
}
