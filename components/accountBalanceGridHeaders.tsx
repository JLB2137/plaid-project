import {motion} from 'framer-motion'
const AccountBalanceGridHeaders = () => {
    const headerProperties = "col-span-1 text-xs font-bold italic"

    return(
        <motion.div
        key='balance headers'
        className="grid grid-row-1 grid-cols-3 bg-slate-400 text-black text-center p-4 shadow-lg"
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5}}
        >
            <h2 className={headerProperties}>Acccount Name</h2>
            <h2 className={headerProperties}>Account Type</h2>
            <h2 className={headerProperties}>Balance</h2>
        </motion.div>
    )
}

export default AccountBalanceGridHeaders