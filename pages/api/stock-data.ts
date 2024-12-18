import { NextApiRequest, NextApiResponse } from "next";
import { TSLAStockMock } from "./mock/stockMock";

// Environment variables
const rapidAPIKey = process.env.RAPIDAPIKEY || "";

// Utility to introduce delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Request Queue
class RequestQueue {
  private queue: (() => Promise<void>)[] = [];
  private delay: number;
  private processing = false;

  constructor(delay: number) {
    this.delay = delay; // Delay between requests in ms
  }

  enqueue(request: () => Promise<void>) {
    this.queue.push(request);
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const nextRequest = this.queue.shift();
      if (nextRequest) {
        await nextRequest();
        await delay(this.delay);
      }
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue(500); // Delay of 2 seconds between requests

// Pricing request
const pricingRequest = async (ticker: string, timePeriod: string, timeInterval: string) => {
    //console.log('fet',`https://yahoo-finance166.p.rapidapi.com/api/stock/get-chart?region=US&range=${timePeriod}&symbol=${ticker}&interval=${timeInterval}`)
    const response = await fetch(
    `https://yahoo-finance166.p.rapidapi.com/api/stock/get-chart?region=US&range=${timePeriod}&symbol=${ticker}&interval=${timeInterval}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidAPIKey,
        "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
      },
    }
  );

  return response.json();
};

// Financials request
const financialsRequest = async (ticker: string) => {
  const response = await fetch(
    `https://yahoo-finance166.p.rapidapi.com/api/stock/get-financial-data?region=US&symbol=${ticker}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidAPIKey,
        "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
      },
    }
  );

  return response.json();
};

// API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const method: string = req.body.method;
  const ticker: string = req.body.ticker;

  if (method === "pricing") {
    const timePeriod: string = req.body.range;
    const timeInterval: string = req.body.interval;

    requestQueue.enqueue(async () => {
      try {
    
        //const historicalData = await pricingRequest(ticker, timePeriod, timeInterval);
        const historicalData = TSLAStockMock
        //console.log('ticker',ticker,'historicalData',historicalData.message)
        if(!historicalData.message){
            res.status(200).json({
                message: "Successfully returned symbol information",
                apiResponse: historicalData.chart.result,
              });
        }else{
        res.status(500).json({
            message: "Error retrieving symbol pricing information",
            error: historicalData.message,
            }); 
        }

      } catch (error) {
        console.error("Pricing Error:", error);
        res.status(500).json({
          message: "Error retrieving symbol pricing information",
          error: error,
        });
      }
    });
  } else if (method === "financials") {
    requestQueue.enqueue(async () => {
      try {
        const financialData = await financialsRequest(ticker);

        if (!financialData.chart?.result) {
          throw new Error("Error retrieving financial data");
        }

        res.status(200).json({
          message: "Successfully returned financial information",
          apiResponse: financialData.chart.result,
        });
      } catch (error) {
        console.error("Financials Error:", error);
        res.status(500).json({
          message: "Error retrieving symbol financial information",
          error: error.message || error,
        });
      }
    });
  } else {
    res.status(400).json({ message: "Invalid method provided" });
  }
}
