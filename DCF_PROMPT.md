# DCF 估值 Prompt（适用于任何 AI 模型）

复制下方 **Prompt 开始** 到 **Prompt 结束** 之间的全部内容，将 `{TICKER}` 替换为目标公司代号，发给 AI 即可。

---

## Prompt 开始

你是一位专业的股票估值分析师。请帮我为 {TICKER} 公司构建一个 20 年 DCF（折现现金流）估值模型。

请查找该公司最新财报数据，并严格按照以下 JSON 格式输出结果。所有金额单位为 **十亿美元（$B）**，百分比为 **数字**（例如 22 表示 22%）。

### 你需要查找的数据

**WACC 部分**（从最新财报/市场数据获取）：

- marketCap：当前市值（$B）
- totalDebt：总债务（$B）
- interestExpense：年利息支出（$B）
- preTaxIncome：税前利润（$B）
- taxProvision：所得税支出（$B）
- beta：Beta 系数（5年月度）
- riskFreeRate：使用当前美国10年期国债收益率（%）
- expectedMarketReturn：使用 10.0（%）

**DCF 部分**（需要你根据财报+行业分析来判断）：

- baseRevenue：最近一个完整财年的总营收（$B）
- historicalGrowthRates：过去 5 年的年营收同比增长率（%），数组长度 5
- revenueGrowthRates：未来 20 年的预测营收增长率（%），数组长度 20
  - 规则：基于历史增长、行业趋势和公司竞争力，从近期高增长逐步递减到成熟期 2-3%
- expectedDiscountRate：期望折现率/期望收益率（%）
  - 规则：通常 9-12%，高风险公司用更高值
- ebitMargins：未来 20 年的 EBIT 利润率（%），数组长度 20
  - 规则：参考当前利润率和行业成熟水平，逐步趋于稳态
- taxRatesForFCF：未来 20 年的税率（%），数组长度 20
  - 规则：参考当前有效税率，逐步趋于法定税率 21%
- daPercents：未来 20 年的折旧摊销占收入比（%），数组长度 20
- capexPercents：未来 20 年的资本支出占收入比（%），数组长度 20
  - 规则：重资产公司较高（7-15%），轻资产/IP公司较低（2-5%）
- nwcChangePercents：未来 20 年的净营运资本变动占收入比（%），数组长度 20
  - 规则：通常 0.5-2%
- terminalGrowthRate：永续增长率（%），通常 2-3%
- cashAndInvestments：现金及短期投资（$B）
- otherInvestments：其他长期投资（$B），没有则填 0
- totalDebt：总债务（$B，与 WACC 部分一致）
- sharesOutstanding：流通股数（十亿股）
- currentPrice：当前股价（$/股）

### FCF 计算公式（供参考）

每年的自由现金流计算方式：

    Revenue = 上一年Revenue × (1 + revenueGrowthRate%)
    EBIT = Revenue × ebitMargin%
    NOPAT = EBIT × (1 - taxRate%)
    D&A = Revenue × daPercent%
    CapEx = Revenue × capexPercent%
    ΔNWC = Revenue × nwcChangePercent%
    FCF = NOPAT + D&A - CapEx - ΔNWC

终值计算：

    Terminal Value = 最后一年FCF × (1 + terminalGrowthRate) / (discountRate - terminalGrowthRate)

企业价值到每股价值：

    Enterprise Value = Σ PV(FCF) + PV(Terminal Value)
    Equity Value = EV + Cash + Other Investments - Total Debt
    Fair Value Per Share = Equity Value / Shares Outstanding

### 输出格式

请严格按以下 JSON 格式输出，不要添加额外字段：

```json
{
  "id": "dcf_{ticker小写}_20y",
  "name": "{TICKER} - {公司全名}",
  "years": 20,
  "createdAt": "{当前ISO时间}",
  "updatedAt": "{当前ISO时间}",
  "wacc": {
    "marketCap": 0, "totalDebt": 0, "interestExpense": 0,
    "preTaxIncome": 0, "taxProvision": 0, "beta": 0,
    "riskFreeRate": 0, "expectedMarketReturn": 10.0
  },
  "dcf": {
    "baseRevenue": 0,
    "revenueGrowthRates": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "historicalGrowthRates": [0,0,0,0,0],
    "expectedDiscountRate": 0,
    "ebitMargins": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "taxRatesForFCF": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "daPercents": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "capexPercents": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "nwcChangePercents": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "terminalGrowthRate": 2.5,
    "cashAndInvestments": 0, "otherInvestments": 0,
    "totalDebt": 0, "sharesOutstanding": 0, "currentPrice": 0
  }
}
```

### 额外要求

1. 在输出 JSON 之前，先简要说明你的关键假设和逻辑（3-5 句话）
2. 所有 20 个元素的数组必须刚好 20 个数字，历史增长率数组必须刚好 5 个数字
3. 数据来源必须基于该公司最新的年报/季报
4. 增长率应从近期较高值逐步递减至成熟期的 2-3%，体现均值回归
5. 如果公司当前亏损或利润率很低，EBIT margin 应体现从低到高的改善路径
6. 请同时给出你计算出的 Fair Value Per Share 和对比当前股价的 Margin of Safety

## Prompt 结束

---

## 使用示例

将 `{TICKER}` 替换后直接发给 AI：

> 你是一位专业的股票估值分析师。请帮我为 **AAPL** 公司构建一个 20 年 DCF 估值模型...

得到 JSON 后，在 Domi DCF Tool 中点击 **Import** 导入即可。
