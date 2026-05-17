import type { DCFModel } from './types.js';
import { getModel, saveModel } from './storage.js';
import { calcWACC, calcDCF, calcSensitivity, validateInputs } from './calc.js';

declare const Chart: any;

let currentModel: DCFModel | null = null;
let fcfChart: any = null;
let evChart: any = null;

function getModelId(): string | null {
  return new URLSearchParams(window.location.search).get('id');
}

function loadModel(): void {
  const id = getModelId();
  if (!id) { window.location.href = '/'; return; }
  const model = getModel(id);
  if (!model) { alert('Model not found'); window.location.href = '/'; return; }
  currentModel = model;
}

function populateForm(): void {
  if (!currentModel) return;
  const m = currentModel;

  (document.getElementById('model-name') as HTMLInputElement).value = m.name;
  document.getElementById('model-years-label')!.textContent = `${m.years}Y`;

  setVal('market-cap', m.wacc.marketCap);
  setVal('total-debt-wacc', m.wacc.totalDebt);
  setVal('interest-expense', m.wacc.interestExpense);
  setVal('pretax-income', m.wacc.preTaxIncome);
  setVal('tax-provision', m.wacc.taxProvision);
  setVal('beta', m.wacc.beta);
  setVal('rf', m.wacc.riskFreeRate);
  setVal('emr', m.wacc.expectedMarketReturn);

  setVal('base-revenue', m.dcf.baseRevenue);
  setVal('terminal-growth', m.dcf.terminalGrowthRate);
  setVal('expected-dr', m.dcf.expectedDiscountRate);
  setVal('cash-investments', m.dcf.cashAndInvestments);
  setVal('other-investments', m.dcf.otherInvestments);
  setVal('total-debt-dcf', m.dcf.totalDebt);
  setVal('shares', m.dcf.sharesOutstanding);
  setVal('current-price', m.dcf.currentPrice);

  renderHistGrowthInputs();
  renderGrowthRateInputs();
  renderAssumptionsTable();
  recalculate();
}

function renderHistGrowthInputs(): void {
  if (!currentModel) return;
  const container = document.getElementById('hist-growth-container')!;
  const rates = currentModel.dcf.historicalGrowthRates;

  // Compute CAGR from individual rates
  let cumulative = 1;
  for (const r of rates) cumulative *= (1 + r / 100);
  const cagr = (Math.pow(cumulative, 1 / rates.length) - 1) * 100;
  const cagrHint = document.getElementById('hist-cagr-hint');
  if (cagrHint) {
    cagrHint.textContent = `5Y CAGR = ${cagr.toFixed(1)}%`;
  }

  let html = '<div class="growth-grid">';
  for (let i = 0; i < rates.length; i++) {
    html += `
      <div class="growth-item">
        <label>Y-${rates.length - i}</label>
        <input type="number" step="0.1" value="${rates[i]}" data-hist-index="${i}" class="hist-growth-input" />
        <span>%</span>
      </div>`;
  }
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll('.hist-growth-input').forEach(input => {
    const handler = (e: Event) => {
      const el = e.target as HTMLInputElement;
      currentModel!.dcf.historicalGrowthRates[parseInt(el.dataset.histIndex!)] = parseFloat(el.value) || 0;
      // Update CAGR display
      let cum = 1;
      for (const r of currentModel!.dcf.historicalGrowthRates) cum *= (1 + r / 100);
      const c = (Math.pow(cum, 1 / currentModel!.dcf.historicalGrowthRates.length) - 1) * 100;
      if (cagrHint) cagrHint.textContent = `5Y CAGR = ${c.toFixed(1)}%`;
    };
    input.addEventListener('change', handler);
    input.addEventListener('input', handler);
  });
}

function renderGrowthRateInputs(): void {
  if (!currentModel) return;
  const container = document.getElementById('growth-rates-container')!;
  const rates = currentModel.dcf.revenueGrowthRates;

  let html = '<div class="growth-grid">';
  for (let i = 0; i < rates.length; i++) {
    html += `
      <div class="growth-item">
        <label>Y${i + 1}</label>
        <input type="number" step="0.1" value="${rates[i]}" data-growth-index="${i}" class="growth-input" />
        <span>%</span>
      </div>`;
  }
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll('.growth-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const el = e.target as HTMLInputElement;
      currentModel!.dcf.revenueGrowthRates[parseInt(el.dataset.growthIndex!)] = parseFloat(el.value) || 0;
      recalculate();
    });
    input.addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      currentModel!.dcf.revenueGrowthRates[parseInt(el.dataset.growthIndex!)] = parseFloat(el.value) || 0;
      recalculate();
    });
  });
}

function renderAssumptionsTable(): void {
  if (!currentModel) return;
  const years = currentModel.dcf.revenueGrowthRates.length;
  const dcf = currentModel.dcf;
  const tbody = document.getElementById('assumptions-tbody')!;

  let html = '';
  for (let i = 0; i < years; i++) {
    html += `<tr>
      <td>Y${i + 1}</td>
      <td><input type="number" step="0.1" value="${dcf.ebitMargins[i]}" data-arr="ebitMargins" data-idx="${i}" class="assumption-input" /></td>
      <td><input type="number" step="0.1" value="${dcf.taxRatesForFCF[i]}" data-arr="taxRatesForFCF" data-idx="${i}" class="assumption-input" /></td>
      <td><input type="number" step="0.1" value="${dcf.daPercents[i]}" data-arr="daPercents" data-idx="${i}" class="assumption-input" /></td>
      <td><input type="number" step="0.1" value="${dcf.capexPercents[i]}" data-arr="capexPercents" data-idx="${i}" class="assumption-input" /></td>
      <td><input type="number" step="0.1" value="${dcf.nwcChangePercents[i]}" data-arr="nwcChangePercents" data-idx="${i}" class="assumption-input" /></td>
    </tr>`;
  }
  tbody.innerHTML = html;

  tbody.querySelectorAll('.assumption-input').forEach(input => {
    const handler = (e: Event) => {
      const el = e.target as HTMLInputElement;
      const arr = el.dataset.arr as keyof typeof dcf;
      const idx = parseInt(el.dataset.idx!);
      (dcf[arr] as number[])[idx] = parseFloat(el.value) || 0;
      recalculate();
    };
    input.addEventListener('change', handler);
    input.addEventListener('input', handler);
  });
}

function recalculate(): void {
  if (!currentModel) return;

  // Validation
  const waccResult = calcWACC(currentModel.wacc);
  const warnings = validateInputs(currentModel.wacc, currentModel.dcf);
  renderWarnings(warnings);

  // Derived WACC parameters
  document.getElementById('res-we')!.textContent = waccResult.weightEquity.toFixed(2) + '%';
  document.getElementById('res-wd')!.textContent = waccResult.weightDebt.toFixed(2) + '%';
  document.getElementById('res-mrp')!.textContent = waccResult.marketRiskPremium.toFixed(2) + '%';
  document.getElementById('res-ke')!.textContent = waccResult.costOfEquity.toFixed(2) + '%';
  document.getElementById('res-kd')!.textContent = waccResult.costOfDebt.toFixed(2) + '%';
  document.getElementById('res-tax')!.textContent = waccResult.effectiveTaxRate.toFixed(2) + '%';
  document.getElementById('res-atcod')!.textContent = waccResult.afterTaxCostOfDebt.toFixed(2) + '%';
  document.getElementById('res-wacc')!.textContent = waccResult.wacc.toFixed(2) + '%';

  const dcfResult = calcDCF(currentModel.dcf);

  document.getElementById('projection-tbody')!.innerHTML = dcfResult.projections.map(p => `
    <tr>
      <td>Y${esc(String(p.year))}</td>
      <td>${esc(p.growthRate.toFixed(1))}%</td>
      <td>${esc(fmt(p.revenue))}</td>
      <td>${esc(fmt(p.ebit))}</td>
      <td>${esc(fmt(p.nopat))}</td>
      <td>${esc(fmt(p.da))}</td>
      <td>${esc(fmt(p.capex))}</td>
      <td>${esc(fmt(p.nwcChange))}</td>
      <td class="highlight">${esc(fmt(p.fcf))}</td>
      <td>${esc(p.discountFactor.toFixed(4))}</td>
      <td class="highlight">${esc(fmt(p.pvFCF))}</td>
    </tr>
  `).join('');

  // Step 1 results
  document.getElementById('res-sum-pv')!.textContent = '$' + fmt(dcfResult.sumPvFCF) + 'B';
  document.getElementById('res-tv')!.textContent = '$' + fmt(dcfResult.terminalValue) + 'B';
  document.getElementById('res-pv-tv')!.textContent = '$' + fmt(dcfResult.pvTerminalValue) + 'B';
  document.getElementById('res-ev')!.textContent = '$' + fmt(dcfResult.enterpriseValue) + 'B';

  const tvPct = dcfResult.enterpriseValue !== 0
    ? ((dcfResult.pvTerminalValue / dcfResult.enterpriseValue) * 100).toFixed(1) + '%'
    : 'N/A';
  document.getElementById('res-tv-pct')!.textContent = tvPct;

  // Step 2: EV → Equity Bridge
  document.getElementById('bridge-ev')!.textContent = '$' + fmt(dcfResult.enterpriseValue) + 'B';
  document.getElementById('bridge-cash')!.textContent = '$' + fmt(dcfResult.cashAndInvestments) + 'B';
  document.getElementById('bridge-other')!.textContent = '$' + fmt(dcfResult.otherInvestments) + 'B';
  document.getElementById('bridge-debt')!.textContent = '$' + fmt(dcfResult.totalDebt) + 'B';
  document.getElementById('bridge-equity')!.textContent = '$' + fmt(dcfResult.equityValue) + 'B';
  document.getElementById('bridge-shares')!.textContent = fmt(dcfResult.projections.length > 0 ? currentModel!.dcf.sharesOutstanding : 0) + 'B';

  // Valuation result
  const fvEl = document.getElementById('res-fair-value')!;
  fvEl.textContent = '$' + fmt(dcfResult.fairValuePerShare);
  const fvCard = fvEl.closest('.result-item')!;
  if (dcfResult.fairValuePerShare < 0) {
    fvCard.classList.add('danger');
    fvCard.classList.remove('success');
  } else {
    fvCard.classList.add('success');
    fvCard.classList.remove('danger');
  }
  document.getElementById('res-current-price')!.textContent = '$' + fmt(dcfResult.currentPrice);

  const mosValue = dcfResult.marginOfSafety;
  const mosEl = document.getElementById('res-mos')!;
  mosEl.textContent = mosValue.toFixed(1) + '%';
  const mosCard = document.getElementById('mos-card')!;
  if (mosValue > 0) {
    mosCard.classList.add('success');
    mosCard.classList.remove('danger');
  } else {
    mosCard.classList.add('danger');
    mosCard.classList.remove('success');
  }

  // Charts
  renderCharts(dcfResult);

  // Sensitivity
  renderSensitivity(currentModel.dcf);
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function esc(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function renderWarnings(warnings: { field: string; message: string }[]): void {
  const container = document.getElementById('validation-warnings')!;
  if (warnings.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = warnings.map(w => {
    const div = document.createElement('div');
    div.className = 'warning-item';
    div.textContent = '\u26A0\uFE0F ' + w.message;
    return div.outerHTML;
  }).join('');
}

function renderCharts(dcfResult: ReturnType<typeof calcDCF>): void {
  if (typeof Chart === 'undefined') return;

  const chartColors = {
    green: 'rgba(57, 231, 95, 0.5)',
    greenBorder: 'rgba(57, 231, 95, 0.9)',
    greenLight: 'rgba(100, 180, 255, 0.35)',
    greenLightBorder: 'rgba(100, 180, 255, 0.8)',
    dim: '#6b7280',
    grid: '#1a1a1a',
  };

  // FCF Bar Chart
  const fcfCtx = (document.getElementById('fcf-chart') as HTMLCanvasElement).getContext('2d');
  if (fcfChart) fcfChart.destroy();
  fcfChart = new Chart(fcfCtx, {
    type: 'bar',
    data: {
      labels: dcfResult.projections.map(p => `Y${p.year}`),
      datasets: [
        {
          label: 'FCF',
          data: dcfResult.projections.map(p => p.fcf),
          backgroundColor: chartColors.green,
          borderColor: chartColors.greenBorder,
          borderWidth: 1,
        },
        {
          label: 'PV(FCF)',
          data: dcfResult.projections.map(p => p.pvFCF),
          backgroundColor: 'rgba(100, 180, 255, 0.25)',
          borderColor: 'rgba(100, 180, 255, 0.7)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: chartColors.dim, font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: chartColors.dim, font: { size: 10 } }, grid: { color: chartColors.grid } },
        y: { ticks: { color: chartColors.dim, font: { size: 10 } }, grid: { color: chartColors.grid } },
      },
    },
  });

  // EV Composition Doughnut
  const evCtx = (document.getElementById('ev-chart') as HTMLCanvasElement).getContext('2d');
  if (evChart) evChart.destroy();
  evChart = new Chart(evCtx, {
    type: 'doughnut',
    data: {
      labels: ['PV of FCFs', 'PV of Terminal Value'],
      datasets: [{
        data: [Math.max(0, dcfResult.sumPvFCF), Math.max(0, dcfResult.pvTerminalValue)],
        backgroundColor: [chartColors.green, chartColors.greenLight],
        borderColor: [chartColors.greenBorder, chartColors.greenLightBorder],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: chartColors.dim, font: { size: 11 }, padding: 16 } },
      },
    },
  });
}

function renderSensitivity(dcfParams: Parameters<typeof calcSensitivity>[0]): void {
  const result = calcSensitivity(dcfParams);
  const baseRate = dcfParams.expectedDiscountRate;

  const headerRow = document.getElementById('sensitivity-header')!;
  headerRow.innerHTML = '<th>DR \\ TG</th>' + result.terminalGrowthRates.map(tg =>
    `<th>${esc(tg.toFixed(1))}%</th>`
  ).join('');

  const tbody = document.getElementById('sensitivity-tbody')!;
  tbody.innerHTML = result.waccRates.map((w, wi) => {
    const isBase = Math.abs(w - baseRate) < 0.01;
    const rowClass = isBase ? ' class="base-row"' : '';
    const cells = result.fairValues[wi].map((fv, ti) => {
      const isBaseCell = isBase &&
        Math.abs(result.terminalGrowthRates[ti] - dcfParams.terminalGrowthRate) < 0.01;
      if (isNaN(fv)) return '<td class="na">N/A</td>';
      const cls = isBaseCell ? ' class="base-cell"' : '';
      return `<td${cls}>${esc(fmt(fv))}</td>`;
    }).join('');
    const label = `${esc(w.toFixed(1))}%${isBase ? ' ★' : ''}`;
    return `<tr${rowClass}><td class="row-header">${label}</td>${cells}</tr>`;
  }).join('');
}

function setVal(id: string, value: number): void {
  (document.getElementById(id) as HTMLInputElement).value = String(value);
}

function readVal(id: string): number {
  return parseFloat((document.getElementById(id) as HTMLInputElement).value) || 0;
}

function collectAndSave(): void {
  if (!currentModel) return;

  currentModel.name = (document.getElementById('model-name') as HTMLInputElement).value.trim() || 'Untitled';
  currentModel.wacc.marketCap = readVal('market-cap');
  currentModel.wacc.totalDebt = readVal('total-debt-wacc');
  currentModel.wacc.interestExpense = readVal('interest-expense');
  currentModel.wacc.preTaxIncome = readVal('pretax-income');
  currentModel.wacc.taxProvision = readVal('tax-provision');
  currentModel.wacc.beta = readVal('beta');
  currentModel.wacc.riskFreeRate = readVal('rf');
  currentModel.wacc.expectedMarketReturn = readVal('emr');

  currentModel.dcf.baseRevenue = readVal('base-revenue');
  currentModel.dcf.terminalGrowthRate = readVal('terminal-growth');
  currentModel.dcf.expectedDiscountRate = readVal('expected-dr');
  // per-year arrays (ebitMargins, taxRatesForFCF, etc.) are saved via assumption-input handlers
  // historicalGrowthRates are saved via hist-growth-input handlers
  currentModel.dcf.cashAndInvestments = readVal('cash-investments');
  currentModel.dcf.otherInvestments = readVal('other-investments');
  currentModel.dcf.totalDebt = readVal('total-debt-dcf');
  currentModel.dcf.sharesOutstanding = readVal('shares');
  currentModel.dcf.currentPrice = readVal('current-price');

  saveModel(currentModel);
  recalculate();
}

function showToast(msg: string): void {
  const toast = document.getElementById('toast')!;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadModel();
  populateForm();

  // Auto-recalculate on input
  document.addEventListener('input', (e) => {
    const el = e.target as HTMLElement;
    if (el.tagName === 'INPUT' && !el.classList.contains('growth-input') && !el.classList.contains('assumption-input') && !el.classList.contains('hist-growth-input')) {
      collectAndSave();
    }
  });

  document.getElementById('btn-save')!.addEventListener('click', () => {
    collectAndSave();
    showToast('Model saved');
  });

  document.getElementById('btn-export')!.addEventListener('click', () => {
    if (!currentModel) return;
    collectAndSave();
    const blob = new Blob([JSON.stringify(currentModel, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentModel.name.replace(/[^a-zA-Z0-9]/g, '_')}-dcf.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Model exported');
  });

  document.getElementById('btn-back')!.addEventListener('click', () => {
    collectAndSave();
    window.location.href = '/';
  });

  // Help modal
  const helpContent: Record<string, { title: string; body: string }> = {
    'wacc-step1': {
      title: 'WACC Step 1 — 财务数据',
      body: `<p><b>Market Cap（市值）</b>：公司所有流通股的市场总价值 = 股价 × 总股数。</p>
<p><b>Total Debt（总负债）</b>：公司所有有息负债的总和，包括短期借款和长期借款。</p>
<p><b>Interest Expense（利息支出）</b>：公司每年为其债务支付的利息总额，从利润表获取。</p>
<p><b>Pre-tax Income（税前利润）</b>：公司扣除利息但未扣税的利润，从利润表获取。</p>
<p><b>Tax Provision（所得税费用）</b>：公司当年实际计提的所得税金额，从利润表获取。</p>
<p><b>Beta（贝塔系数）</b>：衡量个股相对于大盘的波动程度。β=1表示与大盘同步波动，>1波动更大，<1更稳定。</p>
<p><b>Risk-Free Rate（无风险利率）</b>：通常用10年期美国国债收益率，代表零风险的基准回报率。</p>
<p><b>Expected Market Return（预期市场回报率）</b>：股票市场的长期平均回报率，一般取8%-12%。</p>`,
    },
    'wacc-step2': {
      title: 'WACC Step 2 — 推导参数',
      body: `<p><b>Weight of Equity (We)</b>：股权在总资本中的占比 = 市值 / (市值 + 总负债)。</p>
<p><b>Weight of Debt (Wd)</b>：债务在总资本中的占比 = 总负债 / (市值 + 总负债)。</p>
<p><b>Equity Risk Premium (ERP)</b>：股权风险溢价 = 预期市场回报率 - 无风险利率，代表投资者承担股市风险要求的额外回报。</p>
<p><b>Cost of Equity (Ke)</b>：股权成本，用CAPM模型计算：Ke = Rf + β × (Rm - Rf)。代表股东要求的最低回报率。</p>
<p><b>Cost of Debt (Kd)</b>：债务成本 = 利息支出 / 总负债，代表公司借钱的实际利率。</p>
<p><b>Effective Tax Rate</b>：有效税率 = 所得税费用 / 税前利润。因为利息可以抵税，所以税率影响实际借贷成本。</p>
<p><b>After-tax Cost of Debt</b>：税后债务成本 = Kd × (1 - 税率)。利息抵税后的真实借贷成本。</p>
<p><b>WACC</b>：加权平均资本成本 = We×Ke + Wd×Kd×(1-t)。代表公司整体融资的平均成本，这里作为参考值。</p>`,
    },
    'dcf-step1': {
      title: 'DCF Step 1 — FCF预测 → 企业价值',
      body: `<p><b>Base Revenue（基础营收）</b>：公司最近一年的总营业收入，作为未来预测的起点。</p>
<p><b>Terminal Growth Rate (g)（永续增长率）</b>：预测期结束后公司永远保持的增长速度，通常设2-3%，接近GDP增长率。</p>
<p><b>Expected Discount Rate（期望折现率）</b>：你期望的投资回报率，用于将未来现金流折算回今天的价值。越高估值越保守。</p>
<p><b>Historical Growth（历史增长率）</b>：过去5年每年的营收增长率，用于判断增长趋势，帮助设定未来增长率。</p>
<p><b>Revenue Growth by Year（未来各年增长率）</b>：你预测的未来每年营收增长率，直接决定每年的Revenue。</p>
<p><b>EBIT Margin（息税前利润率）</b>：营收中变成经营利润的比例。EBIT = Revenue × EBIT Margin。</p>
<p><b>Tax Rate（税率）</b>：对经营利润征的税率，NOPAT = EBIT × (1 - Tax Rate)。</p>
<p><b>D&A（折旧与摊销）</b>：非现金费用，会计上已扣但实际没花钱，算FCF时要加回来。</p>
<p><b>CapEx（资本支出）</b>：购买设备、建设厂房等长期资产的实际花费，要从FCF中减去。</p>
<p><b>ΔNWC（净营运资本变动）</b>：公司日常运营占用的资金变化，增加意味着钱被占用，要从FCF中减去。</p>
<p><b>FCF = NOPAT + D&A - CapEx - ΔNWC</b></p>
<p><b>EV = Σ PV(FCF) + PV(Terminal Value)</b></p>`,
    },
    'dcf-step2': {
      title: 'DCF Step 2 — 企业价值 → 合理价',
      body: `<p><b>Cash & Short-term Investments（现金及短期投资）</b>：公司账上的现金和容易变现的短期投资，加到EV上因为属于股东。</p>
<p><b>Other Investments（其他投资）</b>：公司持有的长期投资、少数股权等非经营性资产，也属于股东价值。</p>
<p><b>Total Debt（总负债）</b>：公司所有有息负债，要从EV中扣除，因为还债优先于股东分配。</p>
<p><b>Shares Outstanding（流通股数）</b>：公司已发行的总股数（单位：十亿股），用于计算每股价值。</p>
<p><b>Current Stock Price（当前股价）</b>：公司当前的市场交易价格，用于计算安全边际。</p>
<p><b>Equity Value = EV + Cash + Other Investments - Total Debt</b></p>
<p><b>Fair Value / Share = Equity Value ÷ Shares Outstanding</b></p>
<p><b>Margin of Safety（安全边际）= (Fair Value - Current Price) / Fair Value</b></p>
<p>正数表示被低估（有安全边际），负数表示被高估（存在风险）。</p>`,
    },
  };

  document.querySelectorAll('.help-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = (btn as HTMLElement).dataset.help!;
      const content = helpContent[key];
      if (!content) return;
      document.getElementById('help-modal-title')!.textContent = content.title;
      document.getElementById('help-modal-body')!.innerHTML = content.body;
      document.getElementById('help-modal')!.classList.add('show');
    });
  });

  document.getElementById('help-modal-close')!.addEventListener('click', () => {
    document.getElementById('help-modal')!.classList.remove('show');
  });

  document.getElementById('help-modal')!.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('dialog-overlay')) {
      document.getElementById('help-modal')!.classList.remove('show');
    }
  });
});
