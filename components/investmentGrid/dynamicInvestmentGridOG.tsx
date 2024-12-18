import {motion} from 'framer-motion'
import {numberFormatting} from '../../lib/front-end/numberTextFormatting'
import {flexBoxScrollBars} from '../../styles/constants'
import { useFinancialsContext } from '../../context/FinancialsContext'
const DynamicInvestmentGrid = ({key, investment}) => {

    const {getPricing} = useFinancialsContext()

    const test = async (ticker) => {
        await getPricing(ticker,'1y','1d')
    }

    const investmentProperties = "col-span-1 text-sm"
    //need to adjust this for before or afters
    const returnColorScheme = (investmentProperty,comparrisonProperty,textEquation,additionalVariable?,additionalVariablePlacement?) => {
        if(comparrisonProperty>investmentProperty){
            return <p className={investmentProperties + " text-green-400"}>+{numberFormatting(textEquation)}</p>
        }else if(comparrisonProperty<investmentProperty){
            return <p className={investmentProperties + " text-red-600"}>{numberFormatting(textEquation)}</p>
        }else{
            return <p className={investmentProperties + " text-red-600"}>{numberFormatting(textEquation)}</p>
        }
    }


    return(
        <motion.div
        key={key}
        className={"grid grid-row-1 grid-cols-8 bg-slate-400 text-black text-center p-2"}
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5}}
        >
            <button onClick={()=>test(investment.ticker_symbol)}><h4 className={"col-span-1 text-xs font-bold overflow-auto " + flexBoxScrollBars}>{investment.ticker_symbol}</h4></button>
            <p className="col-span-1 text-xs">{investment.name}</p>
            <p className={investmentProperties}>{numberFormatting(investment.close_price)}</p>
            <p className={investmentProperties}>{numberFormatting(investment.quantity)}</p>
            <p className={investmentProperties}>{numberFormatting(investment.cost_basis)}</p>
            <p className={investmentProperties}>{numberFormatting(investment.quantity * investment.close_price)}</p>
            {returnColorScheme(investment.cost_basis,investment.close_price*investment.quantity,investment.close_price*investment.quantity-investment.cost_basis)}
            {returnColorScheme((investment.close_price*investment.quantity-investment.cost_basis)/investment.cost_basis,0,(investment.close_price*investment.quantity-investment.cost_basis)/investment.cost_basis)}

        </motion.div>
    )
}

export default DynamicInvestmentGrid