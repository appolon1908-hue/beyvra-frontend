import './portfolioMenu.scss'
import AssetCard from './card/AssetCard'
import AssetSection from './tableAsset/AssetSection'
import CardInfo from './card/CardInfo'
import PortfolioHeader from './header/PortfolioHeader'
import { useCookies } from 'react-cookie'
import { usePortfolioSummary, type PortfolioSummary } from 'api/portfolio/usePortfolioSummary'
import { toUserSafeErrorText } from 'errors/userSafeError'

const PortfolioMenu = () => {
    const [cookies] = useCookies(["access_token"])
    const { data, isPending, isError, error, refetch } = usePortfolioSummary(cookies.access_token)

    if (isPending) return <div className='portfolioMenu text-white' role='status'>Loading portfolio…</div>
    if (isError) return (
        <div className='portfolioMenu text-white' role='alert'>
            <p>{toUserSafeErrorText(error, 'wallet')}</p>
            <button type='button' onClick={() => refetch()}>Try again</button>
        </div>
    )
    if (!data) return <div className='portfolioMenu text-white' role='status'>No portfolio data is available.</div>

    return (
        <div className='text-white portfolioMenu'>
            <PortfolioHeader />
            <div className='max-w-5xl'>
                <div className='bg-red-0 flex flex-col gap-6 lg:flex-row my-5 justify-between items-center'>
                </div>
            </div>
            <div className='w-full'>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className='w-full'>
                        <div className='w-full'>
                            <CardInfo totalBalance={data.total_balance} profitLoss={data.profit_loss} />
                        </div>
                        <AssetSection holdings={data.holdings} />
                    </div>
                    <div className=' grid sm:grid-cols-2 gap-6'>
                        {data.distributions.length === 0 && <p>No investments yet.</p>}
                        {data.distributions.map((item: PortfolioSummary["distributions"][number]) => (
                            <AssetCard
                                key={item.name}
                                value={item.value}
                                percentage={item.percentage}
                                investment={item.name}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioMenu
