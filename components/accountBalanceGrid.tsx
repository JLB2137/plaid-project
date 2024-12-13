import {motion} from 'framer-motion'
import { toTitleCase, numberFormatting } from '../lib/front-end/numberTextFormatting'
const AccountBalanceGrid = ({account}) => {
    const headerProperties = "col-span-1 text-sm"
    const capitalCasingAccounts = {'cd':'1','hsa':'1','ira':'1'}

    console.log('account ehre', account)
    return(
        <motion.div
        key='headers'
        className="grid grid-row-1 grid-cols-4 bg-slate-400 text-black text-center p-4"
        initial={{opacity: 0, y:50}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5}}
        >
            <h2 className={headerProperties}>{account.institution_name}</h2>
            <h2 className={headerProperties}>{account.accountInfo.name}</h2>
            <h2 className={headerProperties}>{capitalCasingAccounts[account.accountInfo.subtype]? account.accountInfo.subtype.toUpperCase() : toTitleCase(account.accountInfo.subtype)}</h2>
            <h2 className={headerProperties}>${numberFormatting(account.accountInfo.balances.current)}</h2>
        </motion.div>
    )
}

export default AccountBalanceGrid