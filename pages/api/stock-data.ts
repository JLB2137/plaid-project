import {NextApiRequest,NextApiResponse} from "next";
import { TSLAStockMock } from "./mock/stockMock";



const rapidAPIKey = process.env.RAPIDAPIKEY
// process.env.STOCK_API!




// pages/api/user/[id].js
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise < void > {


    const ticker: string = req.body.ticker
    const timePeriod: string = req.body.range
    const timeInterval: string = req.body.interval
    console.log('ticktick',ticker)
    //convert to turnary below
    
    const createLinkToken = async (ticker:string,timePeriod:string,timeInterval:string) => {

        const request = await fetch(`https://yahoo-finance166.p.rapidapi.com/api/stock/get-chart?get-chart?region=US&range=${timePeriod}&symbol=${ticker}&interval=${timeInterval}`,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': rapidAPIKey,
                    'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com'
                }
            } 
        )

        const response = await request.json()

        //console.log('daily',pricing)

        return response


    }

    try{
        //disabled momentarily in favor of mockData
        //const historicalData = await createLinkToken(ticker,timePeriod,timeInterval)
        const historicalData = TSLAStockMock
        if(historicalData.message){
            console.log('history',historicalData.message)
        }
        
        res.status(200).json(
        {
            message: 'Successfully returned symbol information',
            apiResponse: historicalData.chart.result //can be adjusted for multiple stocks

        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: 'Error retreiving symbol information',
            err: error

        })
    }
    

}