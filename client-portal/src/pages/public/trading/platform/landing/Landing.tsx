import React from 'react'
import "./landing.scss"
import { useTranslation } from 'react-i18next'

const Landing = () => {
  const { t } = useTranslation()
  return (
    <div className='landingContainer'>
        <div className='navRouting'>
        </div>
        <h1>{t("tradingHeader")}</h1>
        <p>{t("tradingIntro")}</p>
     </div>

  )
}

export default Landing