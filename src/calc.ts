import type { WACCParams, DCFParams, WACCResult, DCFResult, YearProjection, SensitivityResult, ValidationWarning } from './types.js';

export function calcWACC(w: WACCParams): WACCResult {
  const totalCapital = w.marketCap + w.totalDebt;
  const weightEquity = totalCapital > 0 ? (w.marketCap / totalCapital) * 100 : 100;
  const weightDebt = totalCapital > 0 ? (w.totalDebt / totalCapital) * 100 : 0;

  const marketRiskPremium = w.expectedMarketReturn - w.riskFreeRate;
  const costOfEquity = w.riskFreeRate + w.beta * marketRiskPremium;

  const costOfDebt = w.totalDebt > 0 ? (w.interestExpense / w.totalDebt) * 100 : 0;

  const effectiveTaxRate = w.preTaxIncome > 0 ? (w.taxProvision / w.preTaxIncome) * 100 : 0;

  const afterTaxCostOfDebt = costOfDebt * (1 - effectiveTaxRate / 100);

  const wacc = (weightEquity / 100) * costOfEquity + (weightDebt / 100) * afterTaxCostOfDebt;

  return {
    weightEquity: Math.round(weightEquity * 100) / 100,
    weightDebt: Math.round(weightDebt * 100) / 100,
    costOfEquity: Math.round(costOfEquity * 100) / 100,
    costOfDebt: Math.round(costOfDebt * 100) / 100,
    marketRiskPremium: Math.round(marketRiskPremium * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    afterTaxCostOfDebt: Math.round(afterTaxCostOfDebt * 100) / 100,
    wacc: Math.round(wacc * 100) / 100,
  };
}

export function calcDCF(dcfParams: DCFParams): DCFResult {
  const projections: YearProjection[] = [];
  let revenue = dcfParams.baseRevenue;
  let sumPvFCF = 0;
  const discountRate = dcfParams.expectedDiscountRate;

  for (let i = 0; i < dcfParams.revenueGrowthRates.length; i++) {
    const growthRate = dcfParams.revenueGrowthRates[i];
    revenue = revenue * (1 + growthRate / 100);
    const ebitMargin = dcfParams.ebitMargins[i] ?? dcfParams.ebitMargins[dcfParams.ebitMargins.length - 1];
    const taxRate = dcfParams.taxRatesForFCF[i] ?? dcfParams.taxRatesForFCF[dcfParams.taxRatesForFCF.length - 1];
    const daPct = dcfParams.daPercents[i] ?? dcfParams.daPercents[dcfParams.daPercents.length - 1];
    const capexPct = dcfParams.capexPercents[i] ?? dcfParams.capexPercents[dcfParams.capexPercents.length - 1];
    const nwcPct = dcfParams.nwcChangePercents[i] ?? dcfParams.nwcChangePercents[dcfParams.nwcChangePercents.length - 1];

    const ebit = revenue * (ebitMargin / 100);
    const nopat = ebit * (1 - taxRate / 100);
    const da = revenue * (daPct / 100);
    const capex = revenue * (capexPct / 100);
    const nwcChange = revenue * (nwcPct / 100);
    const fcf = nopat + da - capex - nwcChange;
    const discountFactor = 1 / Math.pow(1 + discountRate / 100, i + 1);
    const pvFCF = fcf * discountFactor;
    sumPvFCF += pvFCF;

    projections.push({
      year: i + 1,
      revenue: Math.round(revenue * 100) / 100,
      growthRate,
      ebit: Math.round(ebit * 100) / 100,
      nopat: Math.round(nopat * 100) / 100,
      da: Math.round(da * 100) / 100,
      capex: Math.round(capex * 100) / 100,
      nwcChange: Math.round(nwcChange * 100) / 100,
      fcf: Math.round(fcf * 100) / 100,
      discountFactor: Math.round(discountFactor * 10000) / 10000,
      pvFCF: Math.round(pvFCF * 100) / 100,
    });
  }

  const lastFCF = projections[projections.length - 1].fcf;
  const drDecimal = discountRate / 100;
  const tgDecimal = dcfParams.terminalGrowthRate / 100;

  let terminalValue = 0;
  let pvTerminalValue = 0;
  if (drDecimal > tgDecimal) {
    terminalValue = (lastFCF * (1 + tgDecimal)) / (drDecimal - tgDecimal);
    pvTerminalValue = terminalValue /
      Math.pow(1 + drDecimal, dcfParams.revenueGrowthRates.length);
  }

  const enterpriseValue = sumPvFCF + pvTerminalValue;

  // Step 2: EV → Equity Bridge
  const equityValue = enterpriseValue
    + dcfParams.cashAndInvestments
    + dcfParams.otherInvestments
    - dcfParams.totalDebt;

  const fairValuePerShare = dcfParams.sharesOutstanding > 0
    ? equityValue / dcfParams.sharesOutstanding
    : 0;

  const marginOfSafety = dcfParams.currentPrice > 0
    ? ((fairValuePerShare - dcfParams.currentPrice) / Math.abs(fairValuePerShare)) * 100
    : 0;

  return {
    projections,
    terminalValue: Math.round(terminalValue * 100) / 100,
    pvTerminalValue: Math.round(pvTerminalValue * 100) / 100,
    sumPvFCF: Math.round(sumPvFCF * 100) / 100,
    enterpriseValue: Math.round(enterpriseValue * 100) / 100,
    cashAndInvestments: dcfParams.cashAndInvestments,
    otherInvestments: dcfParams.otherInvestments,
    totalDebt: dcfParams.totalDebt,
    equityValue: Math.round(equityValue * 100) / 100,
    fairValuePerShare: Math.round(fairValuePerShare * 100) / 100,
    currentPrice: dcfParams.currentPrice,
    marginOfSafety: Math.round(marginOfSafety * 100) / 100,
  };
}

export function calcSensitivity(dcfParams: DCFParams): SensitivityResult {
  const steps = [-1.0, -0.5, 0, 0.5, 1.0];
  const baseRate = dcfParams.expectedDiscountRate;
  const waccRates = steps.map(s => baseRate + s); // label kept as "waccRates" for type compat
  const tgBase = dcfParams.terminalGrowthRate;
  const terminalGrowthRates = steps.map(s => tgBase + s);

  const fairValues: number[][] = [];
  for (const dr of waccRates) {
    const row: number[] = [];
    for (const tg of terminalGrowthRates) {
      if (dr <= tg || dr <= 0) {
        row.push(NaN);
      } else {
        const modified = { ...dcfParams, terminalGrowthRate: tg, expectedDiscountRate: dr };
        const result = calcDCF(modified);
        row.push(result.fairValuePerShare);
      }
    }
    fairValues.push(row);
  }

  return { waccRates, terminalGrowthRates, fairValues };
}

export function validateInputs(wacc: WACCParams, dcf: DCFParams): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (dcf.expectedDiscountRate <= dcf.terminalGrowthRate) {
    warnings.push({
      field: 'terminal-growth',
      message: 'Terminal growth rate must be less than expected discount rate — terminal value is invalid.',
    });
  }

  if (dcf.expectedDiscountRate <= 0) {
    warnings.push({
      field: 'expected-dr',
      message: 'Expected discount rate must be greater than 0.',
    });
  }

  if (dcf.sharesOutstanding <= 0) {
    warnings.push({
      field: 'shares',
      message: 'Shares outstanding must be greater than 0.',
    });
  }

  if (dcf.baseRevenue <= 0) {
    warnings.push({
      field: 'base-revenue',
      message: 'Base revenue must be greater than 0.',
    });
  }

  if (wacc.marketCap <= 0) {
    warnings.push({
      field: 'market-cap',
      message: 'Market cap must be greater than 0.',
    });
  }

  if (wacc.totalDebt > 0 && wacc.interestExpense <= 0) {
    warnings.push({
      field: 'interest-expense',
      message: 'Company has debt but no interest expense — cost of debt will be 0%.',
    });
  }

  if (wacc.preTaxIncome <= 0) {
    warnings.push({
      field: 'pretax-income',
      message: 'Pre-tax income is zero or negative — effective tax rate may be inaccurate.',
    });
  }

  if (wacc.beta < 0) {
    warnings.push({ field: 'beta', message: 'Beta should not be negative.' });
  }

  if (dcf.sharesOutstanding > 10) {
    warnings.push({
      field: 'shares',
      message: `Shares = ${dcf.sharesOutstanding}B (${dcf.sharesOutstanding * 1000}M) — very few companies exceed 10B shares. Confirm the unit is in billions.`,
    });
  }

  if (dcf.cashAndInvestments + dcf.otherInvestments < dcf.totalDebt && dcf.totalDebt > 0) {
    // Not an error, just informational
  }

  return warnings;
}
