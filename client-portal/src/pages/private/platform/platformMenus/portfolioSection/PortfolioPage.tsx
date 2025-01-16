import CardRegular from '../portfolioModal/components/cards/Cards'
import HeaderComponents from '../portfolioModal/components/headerComps/header'
import CapitalInformation from '../portfolioModal/components/capitalInformation/CapitalInformation'
import Distributions from '../portfolioModal/components/distribution/Distributions'
import AssetList from '../portfolioModal/components/assetList/AssetList'
import usePortfolio from 'api/portfolio/usePortfolio'
import { useCookies } from 'react-cookie'

const PortfolioPage = () => {
  // const [getPortfolioInfo, setPortfolioInfo] = useState();
  // const [cookies] = useCookies(["access_token"])

  // const {mutate , isPending } = usePortfolio({
  //   onSuccess: ()=> {

  //   }
  // })

  // useEffect(()=> {
  //   mutate({
  //     token: cookies.access_token
  //   })
  // },[])

  return (
    <div className='h-full bg-[#1d1d1f] p-8 rounded-lg overflow-y-auto'>
        <HeaderComponents/>
        <CapitalInformation/>

        <Distributions/>
        <AssetList/>

        
    </div>
  )
}

export default PortfolioPage