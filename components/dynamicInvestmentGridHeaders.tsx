import {motion} from 'framer-motion'
const InvestmentGridHeaders = () => {
    const headerProperties = "col-span-1 text-xs font-bold italic border-r"
    return(
        <motion.div
        key='headers'
        className="grid grid-row-1 grid-cols-6 bg-slate-400 text-black text-center p-4 shadow-lg"
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5}}
        >
            <h2 className={headerProperties}>Ticker</h2>
            <h2 className={headerProperties}>Company Name</h2>
            <h2 className={headerProperties}>Close Price</h2>
            <h2 className={headerProperties}>Quantity</h2>
            <h2 className={headerProperties}>Cost Basis</h2>
            <h2 className={headerProperties}>Market Value</h2>
        </motion.div>
    )
}

export default InvestmentGridHeaders