import './portfolioMenu.scss'
import AssetCard from './card/AssetCard'
import { investMentPerformanceData } from './data/performacedData'
import AssetSection from './tableAsset/AssetSection'
import CardInfo from './card/CardInfo'
import PortfolioHeader from './header/PortfolioHeader'

const PortfolioMenu = () => {
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
                            <CardInfo />
                        </div>
                        <AssetSection />
                    </div>
                    <div className=' grid sm:grid-cols-2 gap-6'>
                        {investMentPerformanceData.map(item => (
                            <AssetCard
                                value={item.value}
                                percentage={item.percentage}
                                investment={item.investment}
                            // value={item.value}
                            // percentage={(item.c - item.o).toFixed(2)}
                            // investment={item.T}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioMenu