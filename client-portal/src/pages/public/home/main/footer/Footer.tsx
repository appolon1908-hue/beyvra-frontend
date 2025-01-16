import './footer.scss'

import FooterIcon from '../../../../../assets/home/tradxlogo.png'

import XIcon from '../../../../../assets/home/footerSocial/x.png'
import FacebookIcon from '../../../../../assets/home/footerSocial/facebook.png'
import InstagramIcon from '../../../../../assets/home/footerSocial/instagram.png'
import LinkidenIcon from '../../../../../assets/home/footerSocial/linkiden.png'
import YoutubeIcon from '../../../../../assets/home/footerSocial/youtube.png'

const Footer = () => {

    const footerSocial = [
        {
            icon: XIcon,
            url:'',
            lgIconHeight:'25px'
        },
        {
            icon: FacebookIcon,
            url:'',
            lgIconHeight:'28px'
        },
        {
            icon: InstagramIcon,
            url:'',
            lgIconHeight:'32px'
        },
        {
            icon: YoutubeIcon,
            url:'',
            lgIconHeight:'20px'
        },
        {
            icon: LinkidenIcon,
            url:'',
            lgIconHeight:'30px'
        },
    ];

     
  return (
    <div className='footerMainContainer'>
        <div className="footerBackgroundContainer">

        <div className="leftSideFooterContainer">
            <img src={FooterIcon} alt="" />
        </div>
        
        <div className="rightSideFooterContainer">
            {footerSocial.map((social)=>(
                <div className='footersocialItemContainer'>
                    <img src={social.icon} alt="" />
                </div>
            ))}
        </div>
     </div>
    </div>
  )
}

export default Footer