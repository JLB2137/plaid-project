import {motion} from 'framer-motion'
import {numberFormatting} from '../../lib/front-end/numberTextFormatting'
import {flexBoxScrollBars} from '../../styles/constants'
import { useFinancialsContext } from '../../context/FinancialsContext'
import { Background } from 'victory'
import IndividualChartComponent from '../charting/individualChartComponent'
import chartComponent from '../charting/chartComponent'
const DynamicInvestmentGrid = ({key, investment}) => {

    const {getPricing} = useFinancialsContext()

    const onClickHandler = async (ticker:string) => {
        await getPricing(ticker,'1y','1d')
    }

    //need to adjust this for before or afters
    const returnColorScheme = (investmentProperty,comparrisonProperty,textEquation,additionalVariable?,additionalVariablePlacement?) => {
        if(comparrisonProperty<investmentProperty){
            return 'text-green '
        }else if(comparrisonProperty>investmentProperty){
            return 'text-red '
        }else{
            'text-black '
        }
    }

    const unrealizedGainPer = numberFormatting((investment.close_price*investment.quantity-investment.cost_basis)/investment.cost_basis)

    return(
        <motion.div
        key={key}
        role='button'
        whileHover={{scale: 1.05, backgroundColor: '#1f2124'}}
        whileTap={{scale:.95}}
        className={"grid grid-row-1 grid-cols-3 bg-transparent text-black text-center justify-center items-center p-2 hover:text-white"}
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .1}}
        onClick={()=>onClickHandler(investment.ticker_symbol)}
        >
                <h4 className={"col-span-1 col-start-1 text-md font-bold overflow-auto " + flexBoxScrollBars}>{investment.ticker_symbol}</h4>
                <IndividualChartComponent ticker={investment.ticker_symbol} className="text-center justify-self-center"/>
                <div className='col-span-1 col-start-3 grid-col-3'>
                    <p>${investment.close_price}</p>
                    <p className = {returnColorScheme(unrealizedGainPer,0,unrealizedGainPer) + 'text-lg'}>{unrealizedGainPer}%</p>                   
                </div>
        </motion.div>
    )
}

export default DynamicInvestmentGrid