(function() {
  const newModels = [
  {
    "id": "dcf_nvda_20y",
    "name": "NVDA - NVIDIA Corporation",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 5460,
      "totalDebt": 11.04,
      "interestExpense": 0.259,
      "preTaxIncome": 141.45,
      "taxProvision": 21.383,
      "beta": 2.24,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 215.938,
      "revenueGrowthRates": [30,22,16,12,10,8,7,6,5,5,4,4,3,3,3,3,2,2,2,2],
      "historicalGrowthRates": [61.4,0.22,125.86,114.2,65.47],
      "expectedDiscountRate": 12.0,
      "ebitMargins": [58,55,52,48,45,42,40,38,36,35,34,33,32,32,31,31,30,30,30,30],
      "taxRatesForFCF": [15,15,15,15,15,16,16,16,17,17,17,18,18,18,18,18,18,18,18,18],
      "daPercents": [1.3,1.3,1.4,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "capexPercents": [2.8,3.0,3.2,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [3.0,3.0,2.5,2.5,2.0,2.0,2.0,2.0,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 62.556,
      "otherInvestments": 22.251,
      "totalDebt": 11.04,
      "sharesOutstanding": 24.22,
      "currentPrice": 225.32
    }
  },
  {
    "id": "dcf_tsla_20y",
    "name": "TSLA - Tesla Inc",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 1590,
      "totalDebt": 9.229,
      "interestExpense": 0.339,
      "preTaxIncome": 5.437,
      "taxProvision": 1.511,
      "beta": 1.79,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 97.879,
      "revenueGrowthRates": [15,20,25,20,15,12,10,8,7,6,5,5,4,4,3,3,3,3,2,2],
      "historicalGrowthRates": [70.67,51.35,18.80,0.95,-2.93],
      "expectedDiscountRate": 12.0,
      "ebitMargins": [6,8,10,12,14,16,18,19,20,21,22,22,23,23,24,24,24,25,25,25],
      "taxRatesForFCF": [28,25,22,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [6.4,6.0,5.5,5.0,4.5,4.0,3.8,3.5,3.3,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0],
      "capexPercents": [9.7,9.0,8.5,8.0,7.5,7.0,6.5,6.0,5.5,5.0,5.0,4.5,4.5,4.0,4.0,4.0,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [2.0,2.0,2.0,1.5,1.5,1.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 44.743,
      "otherInvestments": 0,
      "totalDebt": 9.229,
      "sharesOutstanding": 3.76,
      "currentPrice": 422.24
    }
  },
  {
    "id": "dcf_googl_20y",
    "name": "GOOGL - Alphabet Inc",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 4810,
      "totalDebt": 95.88,
      "interestExpense": 1.235,
      "preTaxIncome": 194.449,
      "taxProvision": 34.241,
      "beta": 1.27,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 422.498,
      "revenueGrowthRates": [14,12,10,9,8,7,6,6,5,5,4,4,4,3,3,3,3,3,2,2],
      "historicalGrowthRates": [41.15,9.78,8.68,13.87,15.09],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [33,33,34,34,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35],
      "taxRatesForFCF": [18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],
      "daPercents": [5.5,5.5,5.0,5.0,4.5,4.5,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0],
      "capexPercents": [26.0,24.0,22.0,20.0,18.0,16.0,14.0,12.0,11.0,10.0,10.0,9.0,9.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0],
      "nwcChangePercents": [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 126.84,
      "otherInvestments": 0,
      "totalDebt": 95.88,
      "sharesOutstanding": 12.12,
      "currentPrice": 396.78
    }
  },
  {
    "id": "dcf_hims_20y",
    "name": "HIMS - Hims & Hers Health",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 5.80,
      "totalDebt": 1.13,
      "interestExpense": 0.012,
      "preTaxIncome": 0.124,
      "taxProvision": -0.004,
      "beta": 2.42,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 2.37,
      "revenueGrowthRates": [25,20,18,15,12,10,8,7,6,5,5,4,4,3,3,3,3,2,2,2],
      "historicalGrowthRates": [82.77,93.81,65.49,69.33,59.00],
      "expectedDiscountRate": 13.0,
      "ebitMargins": [5,8,10,12,14,16,17,18,19,20,20,21,21,22,22,22,22,22,22,22],
      "taxRatesForFCF": [5,10,15,18,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [2.9,2.8,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5],
      "capexPercents": [8.5,7.5,7.0,6.5,6.0,5.5,5.0,5.0,4.5,4.5,4.0,4.0,4.0,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [2.0,2.0,2.0,1.5,1.5,1.5,1.5,1.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 0.751,
      "otherInvestments": 0,
      "totalDebt": 1.13,
      "sharesOutstanding": 0.231,
      "currentPrice": 25.05
    }
  },
  {
    "id": "dcf_meta_20y",
    "name": "META - Meta Platforms",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 1560,
      "totalDebt": 86.77,
      "interestExpense": 1.5,
      "preTaxIncome": 89.303,
      "taxProvision": 18.716,
      "beta": 1.24,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 214.962,
      "revenueGrowthRates": [15,13,11,10,9,8,7,6,5,5,4,4,3,3,3,3,2,2,2,2],
      "historicalGrowthRates": [37.18,-1.12,15.69,21.94,22.17],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [40,40,39,38,37,36,35,35,34,34,33,33,33,32,32,32,32,32,32,32],
      "taxRatesForFCF": [21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [9.6,9.0,8.5,8.0,7.5,7.0,6.5,6.0,5.5,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0],
      "capexPercents": [35.0,32.0,28.0,25.0,22.0,19.0,16.0,14.0,12.0,10.0,9.0,8.0,8.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0],
      "nwcChangePercents": [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 81.18,
      "otherInvestments": 0,
      "totalDebt": 86.77,
      "sharesOutstanding": 2.54,
      "currentPrice": 614.23
    }
  },
  {
    "id": "dcf_now_20y",
    "name": "NOW - ServiceNow",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 98.05,
      "totalDebt": 2.43,
      "interestExpense": 0.021,
      "preTaxIncome": 2.379,
      "taxProvision": 0.622,
      "beta": 0.82,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 13.96,
      "revenueGrowthRates": [20,18,16,14,12,11,10,9,8,7,6,6,5,5,4,4,3,3,3,3],
      "historicalGrowthRates": [30.47,22.88,23.82,22.44,20.89],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [14,16,18,20,22,24,25,26,27,28,28,29,29,30,30,30,30,30,30,30],
      "taxRatesForFCF": [26,24,22,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [6.0,5.5,5.0,4.5,4.5,4.0,4.0,4.0,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "capexPercents": [5.8,5.5,5.0,5.0,4.5,4.5,4.0,4.0,4.0,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 5.18,
      "otherInvestments": 0,
      "totalDebt": 2.43,
      "sharesOutstanding": 1.03,
      "currentPrice": 95.07
    }
  },
  {
    "id": "dcf_cls_20y",
    "name": "CLS - Celestica Inc",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 41.34,
      "totalDebt": 0.942,
      "interestExpense": 0.055,
      "preTaxIncome": 1.126,
      "taxProvision": 0.167,
      "beta": 1.48,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 13.789,
      "revenueGrowthRates": [20,16,14,12,10,8,7,6,5,5,4,4,3,3,3,3,2,2,2,2],
      "historicalGrowthRates": [-1.97,28.67,9.81,21.17,28.46],
      "expectedDiscountRate": 11.0,
      "ebitMargins": [9,9,10,10,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
      "taxRatesForFCF": [15,15,16,16,17,17,18,18,18,18,18,18,18,18,18,18,18,18,18,18],
      "daPercents": [1.3,1.3,1.3,1.3,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "capexPercents": [2.9,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8],
      "nwcChangePercents": [2.0,2.0,2.0,1.5,1.5,1.5,1.5,1.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 0.378,
      "otherInvestments": 0,
      "totalDebt": 0.942,
      "sharesOutstanding": 0.115,
      "currentPrice": 358.55
    }
  },
  {
    "id": "dcf_ibkr_20y",
    "name": "IBKR - Interactive Brokers",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T21:57:00.000Z",
    "wacc": {
      "marketCap": 38.76,
      "totalDebt": 5.0,
      "interestExpense": 0.1,
      "preTaxIncome": 5.004,
      "taxProvision": 0.440,
      "beta": 1.32,
      "riskFreeRate": 4.25,
      "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 6.447,
      "revenueGrowthRates": [15,13,12,10,9,8,7,6,5,5,4,4,3,3,3,3,2,2,2,2],
      "historicalGrowthRates": [22.36,13.01,41.51,19.47,19.67],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [77,76,75,74,73,72,72,71,71,70,70,70,70,70,70,70,70,70,70,70],
      "taxRatesForFCF": [9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
      "daPercents": [1.6,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "capexPercents": [1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2],
      "nwcChangePercents": [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 5.0,
      "otherInvestments": 0,
      "totalDebt": 5.0,
      "sharesOutstanding": 0.445,
      "currentPrice": 87.00
    }
  }
];
  const key = 'dcf_models';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  for (const model of newModels) {
    const idx = existing.findIndex(m => m.id === model.id);
    if (idx >= 0) existing[idx] = model;
    else existing.push(model);
  }
  localStorage.setItem(key, JSON.stringify(existing));
  alert('8 models injected: NVDA, TSLA, GOOGL, HIMS, META, NOW, CLS, IBKR');
  window.location.href = '/';
})();