import { useState } from 'react'
import './cookiesUse.scss'


const contentOne = (
    <div className='cookiesUseContentItem'>
        <h2>Cookie Name:  Cookies Configured</h2>
        <p>TradX.com Internal Cookies</p>

        <h2>Lawful Basis:</h2>
        <p>Strictly Necessary </p>

        <h2>Description:</h2>
        <p>Stores Customers’ user preference data to make sure that the version of the Website displayed to the customer is their preference.</p>

        <h2>Information Collected:</h2>
        <p>User preferences</p>
        
        <h2>Expiration of Cookie: </h2>
        <p>1 year</p>
        
        <h2>Location:  </h2>
        <p>London & Limburg</p>
    </div>
)
const CookiesUse = () => {
    const [toggleContent, setToggleContent] = useState(0)

    const toggleContentData = [
        contentOne,
        <h1>content2</h1>,
        <h1>content3</h1>
    ]
    
  return (
    <div className='cookiesUseContainer'>
        <h2>3. COOKIES THAT WE USE</h2>
        <h3>3.1   Our own cookies </h3>

        {/* toggle Menu */}
        <div className='cookieUseToggleContainer'>
            <div className='leftSideCookieUseButton'>
                <button onClick={()=>setToggleContent(0)}>Cookies-configured</button>
                <button onClick={()=>setToggleContent(1)}>PHPSESSID</button>
                <button onClick={()=>setToggleContent(2)}>preferred site</button>
            </div>

            <div className="rightSideCookieContent">
                {toggleContentData[toggleContent]}
            </div>

        </div>
    </div>
  )
}

export default CookiesUse