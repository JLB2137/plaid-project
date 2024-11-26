import {motion} from 'framer-motion'
import { toTitleCase, numberFormatting } from '../lib/numberTextFormatting'
const AccountBalanceGrid = ({account}) => {
    const headerProperties = "col-span-1 text-sm"
    const capitalCasingAccounts = {'cd':'1','hsa':'1','ira':'1'}

    return(
        <motion.div
        key='headers'
        className="grid grid-row-1 grid-cols-3 bg-transparent text-black text-center p-4"
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5}}
        >
            <h2 className={headerProperties}>{account.name}</h2>
            <h2 className={headerProperties}>{capitalCasingAccounts[account.subtype]? account.subtype.toUpperCase() : toTitleCase(account.subtype)}</h2>
            <h2 className={headerProperties}>${numberFormatting(account.balances.current)}</h2>
        </motion.div>
    )
}

export default AccountBalanceGrid