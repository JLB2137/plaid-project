import { NextApiRequest, NextApiResponse } from "next";
import { TSLAStockMock } from "./mock/stockMock";
import {RequestQueue} from '../../lib/enqueue'
import { ChartData, PricingErrorResponse } from "../../types/types";
import { pricing, cashflow, income, balance} from "../../lib/api/stockInformation/FMP-API-Routes";

// Environment variables
const APIKEY = process.env.FMP_API_KEY || "";

//need to return to type all responses

const requestQueue = new RequestQueue(500); // Delay of 2 seconds between requests

// Pricing request


// API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const method: string = req.body.method;
  const ticker: string = req.body.ticker;

  if (method === "pricing") {
    const startDate: string = req.body.startDate;
    const endDate: string = req.body.endDate

    requestQueue.enqueue(async () => {
      try {
    
        //const request = await pricing(ticker, startDate, endDate, APIKEY);
        const request = TSLAStockMock
        //console.log('ticker',ticker,'historicalData',request)
        console.log('requestING',request)
        res.status(200).json({
          message: 'Success calling FMP Pricing API',
          response: request
        })

      } catch (error) {
        console.error("Pricing Error:", error);
        res.status(500).json({
          message: "Could not reach FMP Pricing API",
          error: error,
        });
      }
    });
  } else if (method === "income") {
    requestQueue.enqueue(async () => {
  
      requestQueue.enqueue(async () => {
        try {
      
          const request = await income(ticker, APIKEY);
          //const historicalData = TSLAStockMock
          //console.log('ticker',ticker,'historicalData',historicalData)
          res.status(200).json({
            message: 'Success calling FMP Income API',
            response: request
          })
  
        } catch (error) {
          //console.error("Pricing Error:", error);
          res.status(500).json({
            message: "Could not reach FMP Income API",
            error: error,
          });
        }
      });
    })
  } else if (method === "balance") {
    requestQueue.enqueue(async () => {
  
      requestQueue.enqueue(async () => {
        try {
      
          const request = await balance(ticker, APIKEY);
          //const historicalData = TSLAStockMock
          //console.log('ticker',ticker,'historicalData',historicalData)
          res.status(200).json({
            message: 'Success calling FMP Balance API',
            response: request
          })
  
        } catch (error) {
          //console.error("Pricing Error:", error);
          res.status(500).json({
            message: "Could not reach FMP Balance API",
            error: error,
          });
        }
      });
    })
  }  else if (method === "cashflow") {
    requestQueue.enqueue(async () => {
  
      requestQueue.enqueue(async () => {
        try {
      
          const request = await cashflow(ticker, APIKEY);
          //const historicalData = TSLAStockMock
          //console.log('ticker',ticker,'historicalData',historicalData)
          res.status(200).json({
            message: 'Success calling FMP Cashflow API',
            response: request
          })
  
        } catch (error) {
          //console.error("Pricing Error:", error);
          res.status(500).json({
            message: "Could not reach FMP Cashflow API",
            error: error,
          });
        }
      });
    })
  }
}
