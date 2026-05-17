import type { DCFModel, WACCParams, DCFParams } from './types.js';

const STORAGE_KEY = 'dcf_models';

export function getAllModels(): DCFModel[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getModel(id: string): DCFModel | undefined {
  const model = getAllModels().find(m => m.id === id);
  if (model) migrateModel(model);
  return model;
}

// Migrate old models that used netDebt to new cash/investments/totalDebt fields
function migrateModel(model: DCFModel): void {
  const dcf = model.dcf as any;
  if ('netDebt' in dcf && !('cashAndInvestments' in dcf)) {
    const nd = dcf.netDebt || 0;
    dcf.cashAndInvestments = 0;
    dcf.otherInvestments = 0;
    dcf.totalDebt = Math.max(0, nd);
    dcf.currentPrice = 0;
    delete dcf.netDebt;
  }
  if (!('historicalGrowthRates' in dcf)) {
    const oldCagr = dcf.historicalGrowth5Y || 8.0;
    dcf.historicalGrowthRates = [oldCagr, oldCagr, oldCagr, oldCagr, oldCagr];
    delete dcf.historicalGrowth5Y;
  }
  if (!('expectedDiscountRate' in dcf)) {
    dcf.expectedDiscountRate = 10.0;
  }
  if (!('currentPrice' in dcf)) {
    dcf.currentPrice = 0;
  }
  // Migrate single-value margins to per-year arrays
  const years = dcf.revenueGrowthRates ? dcf.revenueGrowthRates.length : 10;
  if ('ebitMargin' in dcf && !('ebitMargins' in dcf)) {
    dcf.ebitMargins = Array(years).fill(dcf.ebitMargin || 15);
    dcf.taxRatesForFCF = Array(years).fill(dcf.taxRateForFCF || 25);
    dcf.daPercents = Array(years).fill(dcf.daPercent || 3);
    dcf.capexPercents = Array(years).fill(dcf.capexPercent || 4);
    dcf.nwcChangePercents = Array(years).fill(dcf.nwcChangePercent || 1);
    delete dcf.ebitMargin;
    delete dcf.taxRateForFCF;
    delete dcf.daPercent;
    delete dcf.capexPercent;
    delete dcf.nwcChangePercent;
  }
}

export function saveModel(model: DCFModel): void {
  const models = getAllModels();
  const idx = models.findIndex(m => m.id === model.id);
  model.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    models[idx] = model;
  } else {
    models.push(model);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

export function deleteModel(id: string): void {
  const models = getAllModels().filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

export function importModels(incoming: DCFModel[]): number {
  const existing = getAllModels();
  let count = 0;
  for (const m of incoming) {
    if (!m.id || !m.wacc || !m.dcf) continue;
    const idx = existing.findIndex(e => e.id === m.id);
    if (idx >= 0) {
      existing[idx] = m;
    } else {
      existing.push(m);
    }
    count++;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return count;
}

export function generateId(): string {
  return 'dcf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

export function createDefaultWACC(): WACCParams {
  return {
    marketCap: 50,              // $50B
    totalDebt: 15,              // $15B
    interestExpense: 0.75,      // $750M
    preTaxIncome: 10,           // $10B
    taxProvision: 2.1,          // $2.1B → 21% tax rate
    beta: 1.0,
    riskFreeRate: 4.25,         // 10Y Treasury
    expectedMarketReturn: 10.0, // ~10% historical avg
  };
}

export function createDefaultDCF(years: 10 | 20): DCFParams {
  return {
    baseRevenue: 10,
    revenueGrowthRates: Array(years).fill(5.0),
    historicalGrowthRates: [10.0, 8.0, 7.0, 6.0, 5.0],
    expectedDiscountRate: 10.0,
    ebitMargins: Array(years).fill(15.0),
    taxRatesForFCF: Array(years).fill(25.0),
    daPercents: Array(years).fill(3.0),
    capexPercents: Array(years).fill(4.0),
    nwcChangePercents: Array(years).fill(1.0),
    terminalGrowthRate: 2.5,
    cashAndInvestments: 5,
    otherInvestments: 1,
    totalDebt: 8,
    sharesOutstanding: 1,
    currentPrice: 100,
  };
}
