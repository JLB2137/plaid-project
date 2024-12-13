
//matches holdings to their corresponding securities and
//organizes them based on which account holds them 
export default function balanceDesconstructor(balances) {

    let accounts = []

    console.log('balance desc',balances)

    for(let i=0;i<balances.length;i++){
        for(let j=0;j<balances[i].accounts.length;j++){
            accounts.push({
                ['accountInfo']: balances[i].accounts[j],
                ['institution_name']: balances[i].item.institution_name

            })
        }
    }

    return accounts
}
