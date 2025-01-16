import React from 'react'
import commission from "../../../../../assets/trading/commission-discounts-icon.png"
import exchangeMonIcon from "../../../../../assets/trading/exchange-money-icon.png"
import graphVector from "../../../../../assets/trading/graph-vector-icon.png"
import wallet from "../../../../../assets/trading/wallet-icon.png"
// import
import './costExplanation.scss'
import { useTranslation } from 'react-i18next'
const CostExplanation = () => {
   const {t} = useTranslation()
 const   items=[{
    title: t("costExplainTitle1"),
    text: t("costExplainTxt1"),
    icon: commission
 },

 {
   title: t("costExplainTitle2"),
   text: t("costExplainTxt2"),
    icon: exchangeMonIcon
 },
 {   title: t("costExplainTitle3"),
   text: t("costExplainTxt3"),
   icon: graphVector
}
,
 {   
   title: t("costExplainTitle4"),
   text: t("costExplainTxt4"),
   icon: wallet }
 ,
 {
   title: t("costExplainTitle5"),
   text: t("costExplainTxt5"),
   icon: wallet 

 },
 {   
   title: t("costExplainTitle6"),
   text: t("costExplainTxt6"),
   icon: exchangeMonIcon

 }
 
 ]
  return (
    <div className='costContainer'>
        <div>
            <h3>{t("costExplained")}</h3>
            <div className='costExp-Wrapper'>
                    {items.map(item => (
                        <div>
                            <span>
                                
                                <img src={item.icon} alt='icon' />
                            </span>
                            <div>
                            <strong>{item.title}</strong>
                            
                            <p>{item.text}</p>
                            </div>

                        </div>

                    ))}
                                
                                
            </div>
        </div>
    </div>
  )
}

export default CostExplanation