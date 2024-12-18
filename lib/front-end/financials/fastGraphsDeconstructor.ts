export const orangeLine = (totalRevenue: number,profitMargins:number,sharesOutstanding:number) => {
    const adjustedEPS = totalRevenue*profitMargins/sharesOutstanding
    return adjustedEPS
}

export const blueLine = () => {
    
}