import {motion} from 'framer-motion'
const DynamicInvestmentGrid = ({key, investment}) => {
    const investmentProperties = "col-span-1 text-sm"
    return(
        <motion.div
        key={key}
        className="grid grid-row-1 grid-cols-6 bg-slate-400 text-black text-center p-2 shadow-lg"
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5}}
        >
            <h4 className="col-span-1 text-xs font-bold">{investment.ticker}</h4>
            <p className={investmentProperties}>{investment.name}</p>
            <p className={investmentProperties}>{Math.round(investment.closePrice*100)/100}</p>
            <p className={investmentProperties}>{Math.round(investment.quantity*100)/100}</p>
            <p className={investmentProperties}>{Math.round(investment.costBasis*100)/100}</p>
            <p className={investmentProperties}>{Math.round(investment.quantity * investment.closePrice*100)/100}</p>
        </motion.div>
    )
}

export default DynamicInvestmentGrid