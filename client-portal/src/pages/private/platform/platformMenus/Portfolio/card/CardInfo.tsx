interface CardInfoProps {
    totalBalance: number;
    profitLoss: number;
}

const CardInfo = ({ totalBalance, profitLoss }: CardInfoProps) => {
    return (
        <div className="grid w-full md:grid-cols-2 gap-4 table-cards">

            <div className='py-2 px-3 bg-gray-100/20 rounded-lg card'>
                <p className='my-4 text-2xl'>
                    Total Portfolio Balance
                </p>
                <p className='my-3 text-4xl'>
                    {totalBalance.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                </p>
            </div>
            <div className='py-2 px-3 bg-gray-100/20 rounded-lg card2'>
                <p className='my-4 text-2xl'>
                    Total Portfolio Profit/Loss
                </p>
                <p className='my-3 text-4xl'>
                    {profitLoss.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                </p>
            </div>

        </div>)
}

export default CardInfo
