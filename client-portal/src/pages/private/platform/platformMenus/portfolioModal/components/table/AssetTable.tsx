import React from 'react'
import './assetList.scss'
import { cryptoData } from '../../data/assetListData'


const AssetTable = () => {
  return (
    <div className="asset-list px-4 sm:px-6 lg:px-8 hover:border-gray-900">
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full border border-gray-200  border-separate border-spacing-0 table-auto">
            <thead className='text-white  overflow-hidden'>
              <tr className=''>
                <th scope="col" className="rounded-tl-2xl rounded-bl-2xl bg-red-20 overflow-hidden sticky top-0 z-10 border-b border-gray-200/50  bg-opacity-75 py-3.5 pl-4 pr-3 text-center text-xs font-semibold  backdrop-blu backdrop-filte sm:pl-6 lg:pl-8">Asset name</th>
                <th scope="col" className="sticky top-0  z-10 border-b border-gray-200/50   bg-opacity-75 px-3 py-3.5 pr-3 text-center text-xs font-semibold backdrop-blu backdrop-filter">Current price of the asset</th>
                <th scope="col" className="sticky top-0 z-10 hidden border-b border-gray-200/50  bg-opacity-75 px-6 py-3.5  text-center text-xs font-semibold  backdrop-blu backdrop-filte sm:table-cell">Number of own assets</th>
                <th scope="col" className="sticky top-0 z-10 hidden border-b border-gray-200/50  bg-opacity-75 px-3 py-3.5 text-center text-xs font-semibold  backdrop-blu backdrop-filte lg:table-cell">Total value of the asset</th>
                <th scope="col" className="rounded-tr-2xl rounded-br-2xl overflow-hidden sticky top-0 z-10 border-b border-gray-200/50  bg-opacity-75 px-3 py-3.5 text-center text-xs font-semibold  backdrop-blu backdrop-filte">Changes in the price</th>
              
              </tr>
            </thead>
                  
            <tbody>
                {cryptoData.map(item => (         
                
                    <tr className=''>
                        <td className="whitespace-nowrap border-b border-gray-200 py-2 pl-3 pr-3 text-sm font-normal sm:pl-6 lg:pl-8">

                        <p className="font-medium  leading-5">{item.assetName} </p>
                        </td>
                        <td className="my-2 text-center  whitespace-nowrap border-b border-gray-200 hidden px-3 py-4 text-sm font-normal sm:table-cell capitalize">
                           ${item.currentPrice}

                        </td>
                        
                        <td className="whitespace-nowrap  border-b border-gray-200 hidden px-3 py-3 text-sm  sm:table-cell text-center">{item.numberOfAssets}</td>
                        <td className="whitespace-nowrap border-b border-gray-200 hidden px-3 py-3 lg:table-cell text-sm  font-normal text-center">${item.totalValueAsset}</td>

                        <td className="whitespace-nowrap border-b border-gray-200 px-3 py-3 text-sm font-normal text-sm  text-center">${item.priceChange}</td>

                    </tr>

                    ))}

            </tbody>     
          </table>
        </div>     
      </div>
    </div>
  </div>
  )
}

export default AssetTable