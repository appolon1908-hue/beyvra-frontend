import { Link } from 'react-router-dom'
import Navbar from '../commonComponents/navbar/Navbar'
import Footer from '../main/footer/Footer'
import './cookieDisclosure.scss'
import CookiesUse from './cookiesUse/CookiesUse'
import Introduction from './introduction/Introduction'
import ThirdPartyCookies from './thirdPartyCookie/ThirdPartyCookies'
import WhatAreCookies from './whatAreCookies/WhatAreCookies'
import CategorySlider from '../commonComponents/categorySlider/CategorySlider'
import TradeTable from '../commonComponents/tradeTable/TradeTable'
import HeadIntro from '../commonComponents/headIntro/HeadIntro'

const CookieDisclosure = () => {

  const pathNames = location.pathname.split('/').filter((x)=>x)
  console.log(location.pathname);
  console.log(pathNames);
  

  return ( 
    <div className='cookieDisclosurePageContainer'>
        <Navbar/>
        <CategorySlider/>
        {/* <HeadIntro/> */}
        {/* <TradeTable/> */}
      {/* custom routing */}
      {/* <div>
        <Link to='/home'>
        <h2>Home</h2>
        </Link>
        {
          pathNames.map((name,index)=>{
            const routeTo = `/${pathNames.slice(0, index + 1).join('/')}`
            const isLast = index === pathNames.length - 1
            return (
               <li key={index}>
                {
                  isLast ? (
                    <h2>name</h2>
                  ): (
                    <Link to={routeTo}>{name}</Link>
                  )
                }
               </li>
          
            )
          
          })
        }
      </div> */}

        {/* page heading */}
        <div className='cookieDisclosureHeadingContainer'>
            <h2>Cookie Disclosure</h2>
            <p>Note: The English version of this Policy is the governing version and shall prevail whenever there is any discrepancy between the English version and the versions in any other language.</p>
        </div>
        
        <Introduction/>
        <WhatAreCookies/>
        <CookiesUse/>
        <ThirdPartyCookies/>
        <Footer/>
    </div>
  )
}

export default CookieDisclosure