import TradeTable from 'pages/public/home/commonComponents/tradeTable/TradeTable'
import React, { useState } from 'react'
import "./tradeTable.scss"
import { useTranslation } from 'react-i18next'

const TradeTableExp = () => {
    const {t} = useTranslation()
    const [selectTable, setSelectedTable] = useState("exppiration_date")

    const navItems = [
        {
            name: "exppiration_date",
            label: t("expirationBtn")
        },
        {
            name: "trading_condition",
            label: t("tradingConditionsBtn")
        },
        {
            name: "holiday",
            label: t("holdiadysBtn")
        },
        {
            name: "trading_schedules",
            label: t("tradingScheduleBtn")
        }
]
  return (
    <div className='tradeTableWrapper'>
        <div className='tableRouting'>

   
            {navItems.map(item => (
                <span className={`${selectTable == item.name && "active"}`} onClick={()=> setSelectedTable(item.name)}>  {item.label}</span>
            ))}
        </div>

        <h2>{t("stayInformHeader")}</h2>

              <TradeTable/>

    </div>
  )
}

export default TradeTableExp