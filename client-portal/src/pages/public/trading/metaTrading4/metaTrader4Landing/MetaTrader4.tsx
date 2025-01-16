

import React from 'react'
import "./metaTrader4.scss"
// import TradingCardInfo from '../tradingCardInfo/TradingCardInfo'
import Navbar from 'pages/public/home/commonComponents/navbar/Navbar'
import { useTranslation } from 'react-i18next'

const MetaTrader4Landing = () => {
  const {t} = useTranslation()
  return (
    <div className='meta4 landingContainer'>
      <Navbar/>
        <h1> {t("metaTrader4")}</h1>
        <p>{t("metaTrader4Text")}</p>




    </div>

  )
}

export default MetaTrader4Landing