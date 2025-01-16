import React from 'react'
import './howIsMarginCal.scss'
import { useTranslation } from 'react-i18next'
const HowIsMarginCal = () => {
  const {t} = useTranslation()
  return (
    <div className='howIsMarginCal'>
        <h3>{t("howIsForexReqMarginCall")}</h3>
        <p>{t("HowForexReqMarginIsCall")}
            <br/>
            <br/>
            {t("HowForexReqMarginIsCall1")}
          </p>
    </div>
  )
}

export default HowIsMarginCal