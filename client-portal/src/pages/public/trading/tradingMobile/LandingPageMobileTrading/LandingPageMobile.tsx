import React from 'react'
import "./landingPageMobile.scss"
import useTransactions from 'api/wallet/useTransactions'
import { useTranslation } from 'react-i18next'

const LandingPageMobile = () => {
  const {t} = useTranslation()
  return (
    <div className='mobile landingContainer'>
     <h1>{t("tradeOnTheGo")}</h1>
     <p>{t("introText")}</p>
  
 </div>

  )
}

export default LandingPageMobile