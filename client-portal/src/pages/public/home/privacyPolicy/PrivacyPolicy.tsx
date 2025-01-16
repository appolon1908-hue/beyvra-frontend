import Navbar from '../commonComponents/navbar/Navbar'
import Footer from '../../../public/landing/footer'
import Consideration from './consideration/Consideration'
import PersonalInformation from './personalInformation/PersonalInformation'
import './privacyPolicy.scss'
import Tradexcom from './tradxcom/Tradexcom'

const PrivacyPolicy = () => {
  return (
    <div className='privacyPolciyPageContainer'>
        <Navbar/>
        <div className="privacyPolicyHeadingContainer">

        <h2>Privacy Policy</h2>
        <p>Note: The English version of this Policy is the governing version and shall prevail whenever there is any discrepancy between the English version and the versions in any other language.</p>
        </div>
        <Tradexcom/>
        <Consideration/>
        <PersonalInformation/>
        <Footer/>
    </div>
  )
}

export default PrivacyPolicy