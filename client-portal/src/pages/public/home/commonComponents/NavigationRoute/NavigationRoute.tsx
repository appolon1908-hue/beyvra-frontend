import { Link, useLocation } from 'react-router-dom'
import './navigationRoute.scss'
import { ArrowRightOS, HomeIcon } from 'assets/icons';
const NavigationRoute = () => {

    const location = useLocation()
    console.log(location.pathname);

    const pathName = location.pathname
    const separatedPaths = pathName.split('/').filter(part => part !== "")
    console.log(separatedPaths);
  return (
    <div className='navigationRouteContainer'>
        <div className="navigationRoutes">
            <Link to='/'>
            <div className='navigationHomeIcon'>
            <HomeIcon height='14'/>
            <h2>Home</h2>
            </div>
            </Link>

            <ArrowRightOS width='15' height='12' stroke='#969696'/>
            <h2>{separatedPaths[0]}</h2>
            <ArrowRightOS width='15' height='12' stroke='#969696'/>

            <h2>{separatedPaths[1]}</h2>
        </div>
    </div>
  )
}

export default NavigationRoute