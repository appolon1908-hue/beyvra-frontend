import TradeTable from 'pages/public/home/commonComponents/tradeTable/TradeTable'
import React, { useState } from 'react'
import "./tradeTable.scss"

const TradeTableAsset = () => {
    const [selectTable, setSelectedTable] = useState("all")

    const navItems = [
        {
            name: "all",
            label: "All"
        },
        {
            name: "stocks",
            label: "Stocks"
        },
        {
            name: "Crpto",
            label: "Crypto"
        },
        {
            name: "commodities",
            label: "Commodities"
        },
        {
            name: "bonds",
            label: "Bonds"
        },
        {
            name: "etfs",
            label: "ETFS"
        }
]
  return (
    <div className='tradeTablAssetWrapper'>
        <div className='tableRouting'>

   
            {navItems.map(item => (
                <span className={`${selectTable == item.name && "active"}`} onClick={()=> setSelectedTable(item.name)}>  {item.label}</span>
            ))}
        </div>

        <TradeTable/>

    </div>
  )
}

export default TradeTableAsset