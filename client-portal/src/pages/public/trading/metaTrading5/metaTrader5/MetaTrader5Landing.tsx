import Navbar from "pages/public/home/commonComponents/navbar/Navbar"
import "./metaTrader5.scss"
import { useTranslation } from "react-i18next"


const MetaTrader5Landing = () => {
  const {t} = useTranslation()
  return (
    <div>
    <div className='meta5 landingContainer'>

    <Navbar/>
        <h1>{t("metaTrader5")}</h1>
        <p>{t("metaTrader5Text")}</p>
    </div>
    
    </div>


  )
}

export default MetaTrader5Landing