import PerksCard from 'pages/public/trading/components/perksCard/PerksCard'
import React from 'react'
import  savyIcon from '../../../../../assets/trading/automation-icon.png'
import graph from '../../../../../assets/trading/Graphs.png'
import signal from '../../../../../assets/trading/podcast-icon.png'
import briefcase from '../../../../../assets/trading/briefcase-icon.png'
import marketIcon from '../../../../../assets/trading/Market.png'
import eyeSightIcon from "../../../../../assets/trading/Eye.png"
import { useTranslation } from 'react-i18next'
import TradingSteps from 'pages/public/trading/components/tradingSteps/TradingSteps'
const Follower = () => {
    const {t} = useTranslation()
    const  items=[{
        title: t("followBenefitTitle1"),
        text: t("followBenefitTxt1"),
        icon: eyeSightIcon
    },
    {
        title: t("followBenefitTitle2"),
        text: t("followBenefitTxt1"),
        icon: graph
    },
    {
        title: t("followBenefitTitle3"),
        text: t("followBenefitTxt3"),
        icon: signal
    },
    {
        title: t("followBenefitTitle4"),
        text: t("followBenefitTxt3"),
        icon: savyIcon
    },{
        title: t("followBenefitTitle5"),
        text: t("followBenefitTxt3"),
        icon: briefcase
    },{
        title: t("followBenefitTitle6"),
        text: t("followBenefitTxt6"),
        icon: marketIcon
    },]
  return (
    <div>
        <h2>{t("followerPerks")}</h2>
            <div className="cardWrapper">
                {items.map(item => (
                        <PerksCard 
                        icon={item.icon}
                        cardTitle={item.title}
                        type='follower'
                        cardText={item.text}
                      />
                ))}

            </div>

            <TradingSteps
        step1={t("step1")}
        step2={t("step2")}
        step3={t("step3")}
        step4={t("step4")}
        step5= {t("step5")}

        />
    </div>
  )
}

export default Follower