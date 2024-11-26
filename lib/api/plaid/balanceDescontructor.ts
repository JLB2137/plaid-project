
//matches holdings to their corresponding securities and
//organizes them based on which account holds them 
export default function balanceDesconstructor(balances) {

    let accounts = []

    for(let i=0;i<balances.length;i++){
        for(let j=0;j<balances[i].accounts.length;j++){
            accounts.push(balances[i].accounts[j])
        }
    }

    return accounts
}
