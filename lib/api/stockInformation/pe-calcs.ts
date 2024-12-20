import { HistoricalIncome, HistoricalPrice, HistoricalCashFlow, HistoricalBalance } from './yourInterfaces'; // Adjust import path accordingly

interface ComputedLines {
  date: string;
  orangeLineEarnings: number; // Normalized operating earnings
  orangeLineCashFlow: number; // Normalized operating cash flow
  orangeLineFreeCashFlow: number; // Normalized free cash flow
  orangeLineEquity: number; // Normalized return on equity
  blueLine: number; // Market valuation (price)
}

export class FastGraphsCalculations {
  private incomeData: HistoricalIncome[] = [];
  private priceData: HistoricalPrice[] = [];
  private cashFlowData: HistoricalCashFlow[] = [];
  private balanceData: HistoricalBalance[] = [];
  private peMultiple: number | null = null;

  // Set the historical data
  setHistoricalData(
    incomeData: HistoricalIncome[],
    priceData: HistoricalPrice[],
    cashFlowData: HistoricalCashFlow[],
    balanceData: HistoricalBalance[]
  ): void {
    this.incomeData = incomeData;
    this.priceData = priceData;
    this.cashFlowData = cashFlowData;
    this.balanceData = balanceData;
  }

  // Calculate the PE multiple from historical data
  calculatePEMultiple(): void {
    const validEntries = this.incomeData.filter((entry) => {
      const matchingPrice = this.priceData.find(priceEntry => priceEntry.date === entry.date)?.adjClose;
      return entry.eps > 0 && matchingPrice > 0;
    });

    if (validEntries.length === 0) {
      throw new Error('No valid EPS and price data to calculate PE multiple.');
    }

    const averagePE = validEntries.reduce((sum, entry) => {
      const matchingPrice = this.priceData.find(priceEntry => priceEntry.date === entry.date)?.adjClose;
      return sum + (matchingPrice! / entry.eps);
    }, 0) / validEntries.length;

    this.peMultiple = averagePE;
  }

  // Compute orange and blue lines for normalized metrics and market valuation
  computeLines(): ComputedLines[] {
    if (this.peMultiple === null) {
      throw new Error('PE multiple must be calculated before computing lines.');
    }

    const lines: ComputedLines[] = [];

    // Create orange lines based on income data
    this.incomeData.forEach((incomeEntry) => {
      const matchingBalance = this.balanceData.find(balanceEntry => balanceEntry.date === incomeEntry.date);

      if (!matchingBalance) return;

      const equity = matchingBalance.totalStockholdersEquity;
      const adjustedOperatingEarnings = incomeEntry.operatingIncome + (matchingBalance.interestExpense || 0);
      const normalizedOperatingEarnings = adjustedOperatingEarnings * this.peMultiple!;
      const returnOnEquity = equity > 0 ? (incomeEntry.netIncome / equity) * this.peMultiple! : 0;

      lines.push({
        date: incomeEntry.date,
        orangeLineEarnings: normalizedOperatingEarnings,
        orangeLineCashFlow: NaN,
        orangeLineFreeCashFlow: NaN,
        orangeLineEquity: returnOnEquity,
        blueLine: NaN,
      });
    });

    // Add blue line data based on price data
    this.priceData.forEach((priceEntry) => {
      const existingLine = lines.find(line => line.date === priceEntry.date);

      if (existingLine) {
        existingLine.blueLine = priceEntry.adjClose;
      } else {
        lines.push({
          date: priceEntry.date,
          orangeLineEarnings: NaN,
          orangeLineCashFlow: NaN,
          orangeLineFreeCashFlow: NaN,
          orangeLineEquity: NaN,
          blueLine: priceEntry.adjClose,
        });
      }
    });

    return lines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

