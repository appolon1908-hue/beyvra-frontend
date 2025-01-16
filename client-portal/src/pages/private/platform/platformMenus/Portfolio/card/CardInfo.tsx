import { useAppSelector } from "@store/hooks";

const CardInfo = () => {
    const { current_balance, profit_loss } = useAppSelector((state) => state.socketStockCrypto);
    return (
        <div className="grid w-full md:grid-cols-2 gap-4 table-cards">

            <div className='py-2 px-3 bg-gray-100/20 rounded-lg card'>
                <p className='my-4 text-2xl'>
                    Total Portfolio Balance
                </p>
                <p className='my-3 text-4xl'>
                    {`$${current_balance}`}
                </p>
            </div>
            <div className='py-2 px-3 bg-gray-100/20 rounded-lg card2'>
                <p className='my-4 text-2xl'>
                    Total Portfolio Profit/Loss
                </p>
                <p className='my-3 text-4xl'>
                    {`$${profit_loss}`}
                </p>
            </div>

        </div>)
}

export default CardInfo