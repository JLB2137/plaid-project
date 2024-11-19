const InvestmentCard = ({investments,cardState,onClick}) => {
    

    if(cardState){
        return(
            <ul onClick={onClick} className="flex flex-col border border-gray-300 rounded-lg p-4 m-4 bg-white shadow-md">
                <li>{investments.ticker}</li>
            </ul>
        )
    }else{
        return(
            <ul onClick={onClick} className="flex flex-col border border-gray-300 rounded-lg p-4 m-4 bg-white shadow-md">
                <li>Asset Name: {investments.name}</li>
                <li>Ticker: {investments.ticker}</li>
                <li>Price: ${investments.closePrice}</li>
                <li>Quantity Owned: {investments.quantity}</li>
                <li>Market Value: ${investments.quantity! * investments.closePrice!}</li>
            </ul>
        )
    }


}

export default InvestmentCard