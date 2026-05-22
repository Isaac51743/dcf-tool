(function() {
  const updatedModels = [
  {
    "id": "dcf_nvda_20y",
    "name": "NVDA - NVIDIA Corporation",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 5460, "totalDebt": 11.04, "interestExpense": 0.259,
      "preTaxIncome": 141.45, "taxProvision": 21.383, "beta": 2.24,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 215.938,
      "revenueGrowthRates": [74,48,32,22,16,12,9,7,6,5,5,4,4,3,3,3,2,2,2,2],
      "historicalGrowthRates": [52.73,61.4,0.22,125.86,114.2],
      "expectedDiscountRate": 9.0,
      "ebitMargins": [62,61,59,57,55,53,51,49,47,46,45,44,44,44,44,44,44,44,44,44],
      "taxRatesForFCF": [15,15,15,15,15,15,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
      "daPercents": [1.3,1.3,1.4,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "capexPercents": [2.8,3.0,3.2,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [2.5,2.0,2.0,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 62.556, "otherInvestments": 22.251,
      "totalDebt": 11.04, "sharesOutstanding": 24.22, "currentPrice": 225.32
    }
  },
  {
    "id": "dcf_tsla_20y",
    "name": "TSLA - Tesla Inc",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 1590, "totalDebt": 9.229, "interestExpense": 0.339,
      "preTaxIncome": 5.437, "taxProvision": 1.511, "beta": 1.79,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 97.879,
      "revenueGrowthRates": [22,32,40,33,27,22,17,14,11,8,7,6,5,4,4,3,3,3,2,2],
      "historicalGrowthRates": [28.31,70.67,51.35,18.80,0.95],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [7,12,17,23,27,30,32,33,33,33,33,33,33,33,33,33,33,33,33,33],
      "taxRatesForFCF": [25,22,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [6.4,6.0,5.5,5.0,4.5,4.0,3.8,3.5,3.3,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0],
      "capexPercents": [9.0,8.0,7.0,6.5,6.0,5.5,5.0,4.5,4.0,4.0,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [2.0,1.5,1.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 44.743, "otherInvestments": 0,
      "totalDebt": 9.229, "sharesOutstanding": 3.76, "currentPrice": 422.24
    }
  },
  {
    "id": "dcf_googl_20y",
    "name": "GOOGL - Alphabet Inc",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 4810, "totalDebt": 95.88, "interestExpense": 1.235,
      "preTaxIncome": 194.449, "taxProvision": 34.241, "beta": 1.27,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 422.498,
      "revenueGrowthRates": [18,17,15,13,11,10,9,8,7,6,5,5,4,4,3,3,3,3,2,2],
      "historicalGrowthRates": [12.77,41.15,9.78,8.68,13.87],
      "expectedDiscountRate": 9.0,
      "ebitMargins": [37,39,41,42,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
      "taxRatesForFCF": [18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18],
      "daPercents": [5.5,6.0,7.0,7.5,7.5,7.0,6.5,6.0,5.5,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0],
      "capexPercents": [22.0,17.0,13.0,10.0,9.0,8.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0,7.0],
      "nwcChangePercents": [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 126.84, "otherInvestments": 0,
      "totalDebt": 95.88, "sharesOutstanding": 12.12, "currentPrice": 396.78
    }
  },
  {
    "id": "dcf_hims_20y",
    "name": "HIMS - Hims & Hers Health",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 5.80, "totalDebt": 1.13, "interestExpense": 0.012,
      "preTaxIncome": 0.124, "taxProvision": -0.004, "beta": 2.42,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 2.37,
      "revenueGrowthRates": [27,22,19,16,13,10,8,7,6,5,5,4,3,3,3,3,2,2,2,2],
      "historicalGrowthRates": [80.18,82.77,93.81,65.49,69.33],
      "expectedDiscountRate": 12.5,
      "ebitMargins": [5,9,13,16,19,21,22,23,23,24,24,24,24,24,24,24,24,24,24,24],
      "taxRatesForFCF": [5,10,15,18,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [2.9,2.8,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5],
      "capexPercents": [8.5,7.0,6.0,5.5,5.0,4.5,4.0,4.0,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [2.0,1.5,1.5,1.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 0.751, "otherInvestments": 0,
      "totalDebt": 1.13, "sharesOutstanding": 0.231, "currentPrice": 25.05
    }
  },
  {
    "id": "dcf_meta_20y",
    "name": "META - Meta Platforms",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 1560, "totalDebt": 86.77, "interestExpense": 1.5,
      "preTaxIncome": 89.303, "taxProvision": 18.716, "beta": 1.24,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 214.962,
      "revenueGrowthRates": [28,22,18,14,12,10,8,7,6,5,5,4,4,3,3,3,2,2,2,2],
      "historicalGrowthRates": [21.60,37.18,-1.12,15.69,21.94],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [42,44,45,46,46,45,44,43,42,41,40,39,38,37,36,36,35,35,35,35],
      "taxRatesForFCF": [21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [10,12,14,15,15,14,12,11,10,9,8,8,7,7,7,7,7,7,7,7],
      "capexPercents": [32,24,18,14,12,10,9,8,7,7,7,7,7,7,7,7,7,7,7,7],
      "nwcChangePercents": [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 81.18, "otherInvestments": 0,
      "totalDebt": 86.77, "sharesOutstanding": 2.54, "currentPrice": 614.23
    }
  },
  {
    "id": "dcf_now_20y",
    "name": "NOW - ServiceNow",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 98.05, "totalDebt": 2.43, "interestExpense": 0.021,
      "preTaxIncome": 2.379, "taxProvision": 0.622, "beta": 0.82,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 13.96,
      "revenueGrowthRates": [25,22,20,18,16,14,12,10,9,8,7,6,5,5,4,4,3,3,3,3],
      "historicalGrowthRates": [30.61,30.47,22.88,23.82,22.44],
      "expectedDiscountRate": 9.5,
      "ebitMargins": [32,34,36,37,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38],
      "taxRatesForFCF": [22,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [6.0,5.5,5.0,4.5,4.5,4.0,4.0,4.0,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "capexPercents": [5.8,5.0,4.5,4.0,4.0,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "nwcChangePercents": [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 5.18, "otherInvestments": 0,
      "totalDebt": 2.43, "sharesOutstanding": 1.03, "currentPrice": 95.07
    }
  },
  {
    "id": "dcf_cls_20y",
    "name": "CLS - Celestica Inc",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 41.34, "totalDebt": 0.942, "interestExpense": 0.055,
      "preTaxIncome": 1.126, "taxProvision": 0.167, "beta": 1.48,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 13.789,
      "revenueGrowthRates": [35,28,22,16,12,10,8,6,5,4,4,3,3,3,2,2,2,2,2,2],
      "historicalGrowthRates": [-2.38,-1.97,28.67,9.81,21.17],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [10,11,12,13,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15],
      "taxRatesForFCF": [15,15,16,16,17,17,18,18,18,18,18,18,18,18,18,18,18,18,18,18],
      "daPercents": [1.3,1.3,1.3,1.3,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "capexPercents": [2.9,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8,2.8],
      "nwcChangePercents": [2.0,1.5,1.5,1.5,1.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 0.378, "otherInvestments": 0,
      "totalDebt": 0.942, "sharesOutstanding": 0.115, "currentPrice": 358.55
    }
  },
  {
    "id": "dcf_ibkr_20y",
    "name": "IBKR - Interactive Brokers",
    "years": 20,
    "createdAt": "2026-05-17T21:57:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 38.76, "totalDebt": 5.0, "interestExpense": 0.1,
      "preTaxIncome": 5.004, "taxProvision": 0.440, "beta": 1.32,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 6.447,
      "revenueGrowthRates": [18,16,14,12,10,9,8,7,6,5,5,4,4,3,3,3,2,2,2,2],
      "historicalGrowthRates": [14.51,22.36,13.01,41.51,19.47],
      "expectedDiscountRate": 10.0,
      "ebitMargins": [77,76,75,74,73,72,71,70,70,70,70,70,70,70,70,70,70,70,70,70],
      "taxRatesForFCF": [9,9,10,10,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
      "daPercents": [1.6,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5],
      "capexPercents": [1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2],
      "nwcChangePercents": [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 5.0, "otherInvestments": 0,
      "totalDebt": 5.0, "sharesOutstanding": 1.2, "currentPrice": 87.00
    }
  },
  {
    "id": "dcf_sofi_20y",
    "name": "SOFI - SoFi Technologies",
    "years": 20,
    "createdAt": "2026-05-17T21:24:00.000Z",
    "updatedAt": "2026-05-17T23:35:00.000Z",
    "wacc": {
      "marketCap": 20.02, "totalDebt": 1.814, "interestExpense": 0.12,
      "preTaxIncome": 0.646, "taxProvision": 0.069, "beta": 2.13,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 3.908,
      "revenueGrowthRates": [38,30,24,20,16,13,10,8,7,6,5,5,4,4,3,3,3,2,2,2],
      "historicalGrowthRates": [72.81,55.45,36.11,27.82,35.56],
      "expectedDiscountRate": 11.5,
      "ebitMargins": [8,12,15,18,20,22,23,24,25,25,25,25,25,25,25,25,25,25,25,25],
      "taxRatesForFCF": [10.6,12,15,18,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21],
      "daPercents": [6.3,6.0,5.5,5.0,4.5,4.0,3.8,3.5,3.3,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0],
      "capexPercents": [6.6,6.0,5.5,5.0,4.5,4.0,3.8,3.5,3.3,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0,3.0],
      "nwcChangePercents": [2.0,2.0,1.8,1.5,1.5,1.2,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 3.0,
      "cashAndInvestments": 6.992, "otherInvestments": 0,
      "totalDebt": 1.814, "sharesOutstanding": 1.28, "currentPrice": 15.61
    }
  },
  {
    "id": "dcf_arm_20y",
    "name": "ARM - Arm Holdings plc",
    "years": 20,
    "createdAt": "2026-05-22T14:33:00.000Z",
    "updatedAt": "2026-05-22T14:33:00.000Z",
    "wacc": {
      "marketCap": 317.3, "totalDebt": 0.432, "interestExpense": 0.00971,
      "preTaxIncome": 1.157, "taxProvision": 0.253, "beta": 3.41,
      "riskFreeRate": 4.25, "expectedMarketReturn": 10.0
    },
    "dcf": {
      "baseRevenue": 4.92,
      "revenueGrowthRates": [28,26,24,22,20,18,15,13,11,9,8,7,6,5,5,4,4,3,3,3],
      "historicalGrowthRates": [33.35,-0.89,20.68,23.94,22.79],
      "expectedDiscountRate": 9.5,
      "ebitMargins": [22,26,30,34,38,42,45,48,50,52,53,54,55,55,55,55,55,55,55,55],
      "taxRatesForFCF": [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      "daPercents": [5.0,4.8,4.5,4.3,4.0,3.8,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5],
      "capexPercents": [4.0,3.8,3.5,3.3,3.0,3.0,3.0,2.8,2.8,2.8,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5],
      "nwcChangePercents": [1.5,1.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],
      "terminalGrowthRate": 2.5,
      "cashAndInvestments": 3.601, "otherInvestments": 0.387,
      "totalDebt": 0.432, "sharesOutstanding": 1.06, "currentPrice": 298.23
    }
  }
];
  const key = 'dcf_models';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  for (const model of updatedModels) {
    const idx = existing.findIndex(m => m.id === model.id);
    if (idx >= 0) existing[idx] = model;
    else existing.push(model);
  }
  localStorage.setItem(key, JSON.stringify(existing));
  alert('All 10 models calibrated to Wall Street consensus targets');
  window.location.href = '/';
})();