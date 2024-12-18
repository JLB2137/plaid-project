import {motion} from 'framer-motion'
const InvestmentGridHeaders = () => {
    const headerProperties = "col-span-1 text-xs font-bold italic"
    return(
        <motion.div
        key='headers'
        className="grid grid-row-1 grid-cols-2 bg-transparent text-black text-center p-3 shadow-lg"
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5}}
        >
            <h2 className={headerProperties}>Ticker</h2>
            <h2 className={headerProperties}>Unrealized Gain %</h2>
        </motion.div>
    )
}

export default InvestmentGridHeaders