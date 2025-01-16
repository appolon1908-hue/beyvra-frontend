import { NotificationIcon3 } from 'assets/icons'
import SearchBar from 'components/searchBar/SearchBar'
import React from 'react'
import Selector from '../../portfolioModal/components/headerSelector/Selector'
import { getDate } from 'utils/utils'


const PortfolioHeader = () => {
    return (
        <header>
            <div className='flex justify-between flex-1'>

                <div className='flex flex-col md:flex-row flex-1 items-center gap-10 '>
                    <h2 className='text-[28px] font-semibold'>
                        Portfolio Overview
                    </h2>
                    <div>
                        <p className='text-lg font-semibold '>Latest update</p>
                        <p className='text-base font-semibold'>{getDate(true)}</p>
                    </div>
                </div>
                <div className='hidden md:flex flex-1 h-12 bg-red-20 items-center justify-end gap-6 bg--50 pr-10'>
                    <div className='basis-[40%]'>
                        <SearchBar className='header w-full' />

                    </div>

                    <span className='bg-white w-[44px] h-[44px] rounded-lg shrink-0 flex justify-center items-center'>
                        <NotificationIcon3 />

                    </span>
                    <Selector
                        options={[]} />

                </div>
            </div>

        </header>
    )
}

export default PortfolioHeader