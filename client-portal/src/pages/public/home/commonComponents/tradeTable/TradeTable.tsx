import './tradeTable.scss'

import Graph1Image from '../../../../../assets/home/graph1.png'
import Graph2Image from '../../../../../assets/home/graph2.png'
import Graph3Image from '../../../../../assets/home/graph3.png'
import Graph4Image from '../../../../../assets/home/graph4.png'
import { ArrowLeftOS, ArrowRightOS } from 'assets/icons'
import { useTranslation } from 'react-i18next'


interface TradeTableProps{
  data?:Array<{
    name?:string
    sell?:string
    buy?:string
    change:string
    graph?:string
  }>
}
const TradeTable:React.FC<TradeTableProps> = ({data}) => {
  const { t } = useTranslation()
  const defaultData = [
    {  name: 'crudeOil', sell: '399.53', buy: '400.23', change: '-2.04%', graph:Graph1Image },
    {  name: 'corn', sell: '399.53', buy: '400.23', change: '-1.66%', graph:Graph1Image },
    {  name: 'brentOil', sell: '80.90', buy: '80.95', change: '+2.02%', graph:Graph2Image },
    {  name: 'coffee', sell: '179.63', buy: '180.03', change: '-1.83%', graph:Graph3Image },
    {  name: 'brentOilFutures', sell: '81.69', buy: '81.74', change: '+2.06%', graph:Graph4Image },
  ];

  const tableData = data || defaultData;
  return (
    <div className="tradeTableContainer">

        <div className='tradeTableContainer'>
        <div className="trade-table-container">
      <div className="trade-table-header">
        <div>{t("asset")}</div>
        <div>{t("sell")}</div>
        <div>{t("buy")}</div>
        <div>{t("change")} (%)</div>
      </div>
      { tableData.map((item, index) => (
        <div className="trade-table-row" key={index}>
          <div className={`trade `}>
          <div className='circleIcon'>

          </div>
            <span>{t(item.name ? item.name : "")}</span>
          </div>
          <div className={`sell ${item.change.startsWith('-') ? 'negative' : 'positive'}`}>{item.sell}</div>
          <div className={`buy ${item.change.startsWith('-') ? 'negative' : 'positive'}`}>{item.buy}</div>
          <div className="changeTableGraph">
            <span>{item.change}</span>
            <img src={item.graph} alt={`${item.name} flag`} />
          </div>
        </div>
      ))}
    </div>
        <div className='tradeTableBottomTitle'>
        <h2>{t("viewFullCommoditiesCFDslist")}</h2>
        <ArrowRightOS stroke='#FF1802'/>


        </div>
        </div>
    </div>

  )
}

export default TradeTable