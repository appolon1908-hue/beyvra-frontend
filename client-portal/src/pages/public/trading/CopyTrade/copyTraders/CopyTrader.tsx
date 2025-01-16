import PerksCard from 'pages/public/trading/components/perksCard/PerksCard'
import walletIcon from '../../../../../assets/trading/wallet-icon.png'
import people from '../../../../../assets/trading/people-icon.png'
import commissionIcon from "../../../../../assets/trading/commission-discounts-icon.png"
import chartIcon from "../../../../../assets/trading/chart.png"
import peopleIon from "../../../../../assets/trading/people-icon.png"
import peopleIcon from "../../../../../assets/trading/People.png"
import charUpIcon from "../../../../../assets/trading/chart-arrow-up-icon.png"
import { useTranslation } from 'react-i18next'
import TradingSteps from 'pages/public/trading/components/tradingSteps/TradingSteps'
const CopyTrader = () => {
    const {t} = useTranslation()

    const  items=[{
        text: t("copyTradeBenefitTxt1"),
        icon: walletIcon
    },{

        text: t("copyTradeBenefitTxt2"),
        icon: peopleIcon
    },{
        text: t("copyTradeBenefitTxt3"),
        icon: commissionIcon
    },{
        text: t("copyTradeBenefitTxt4"),
        icon: chartIcon
    },{
        text: t("copyTradeBenefitTxt5"),
        icon: peopleIon
    },{
        text: t("copyTradeBenefitTxt6"),
        icon: commissionIcon
    },]
  return (
    <div>
         <h2>{t("copyTraderPerks")}</h2>
                <div className="cardWrapper">
                {items.map(item => (
                        <PerksCard 
                        icon={item.icon}
                        type='trade'
                        cardText={item.text}
                      />
                ))}

            </div>

            <TradingSteps
        step1={t("step1")}
        step2={t("step2")}
        step3={t("step3")}
        step4={t("step4")}

        />
    </div>
  )
}

export default CopyTrader