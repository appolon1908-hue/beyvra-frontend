import { Dot } from 'assets/icons'
import './consideration.scss'

const Consideration = () => {
  return (
    <div className='considerationContainer'>
        <div className="considerationHeadingContainer">

        <h2>Consideration of Personal Information Privacy </h2>
        <p>We are committed to being open and transparent about how we manage your personal information. Where our documents or interactions with you ask for personal information, we will generally state the purposes for its use and to whom it may be disclosed. </p>
        
        </div>
        <div className="considerationHeadingTwoContainer">
            <h2>Collection of Personal Information </h2>
            <p>The company collects the necessary information required to perform our service including to open an account, execute transactions, safeguard your assets and your privacy and provide you with the services you require. To this end, the company gathers information from you and may, in certain circumstances, gather information from relevant banks and/or credit agencies, and/or other sources which help us profile your requirements and preferences and provide better services to you. <br/><br/>
            The information we collect may include: </p>
        </div>
        <div className="considerationInformationContainer">
            <div className="considerationInformationItemContainer">
                <div className='considrationItemHeadingContainer'>
                    <Dot color='white' width='22px' height='22px'/>
                    <h2>Application information </h2>
                </div>
                <p>Personal information you provide us in your application, such as your name, address, date of birth, email address, employment details, income and income source, tax file number etc., is used in order to facilitate the assessment of your application. The information you provide us is also used for the purposes of communicating with you. </p>
            </div>

            <div className="considerationInformationItemContainer">
                <div className='considrationItemHeadingContainer'>
                    <Dot color='white' width='22px' height='22px'/>
                    <h2>Application information </h2>
                </div>
                <p>Information to assess your trading experience and suitability to transact using our products and services as well as information about the anticipated volume and value of your transactions with us is used to enable the construction of your economic profile. </p>
            </div>

            <div className="considerationInformationItemContainer">
                <div className='considrationItemHeadingContainer'>
                    <Dot color='white' width='22px' height='22px'/>
                    <h2>Verification information</h2>
                </div>
                <p>Information necessary to verify your identity is collected from you, such as an identification card, passport number or driver's license number. This also may include background information we receive about you from public records or from other entities not affiliated with us. <br/><br/>

This information may come from an application form, opening or maintaining an account with us, using our products and services, calling us or visiting our website. Please note that we may record our telephone conversations with you.<br/><br/> 

Please also note that because of the nature of the services we provide and our regulatory obligations we do not have the option of allowing you to deal with us on an anonymous basis. If you choose not to provide the information we need to fulfill your request for a specific product or service, we may not be able to provide you with the requested product or service.  </p>
            </div>
        </div>
    </div>
  )
}

export default Consideration