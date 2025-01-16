import { HomeIcon, RightArrowIcon1 } from 'assets/icons'
import React from 'react'
import './navRoute.scss'

const NavRoute = ({location} : {location: string}) => {
  return (
    <div className='navRouting'>
        <HomeIcon /> <span>Trading</span> <RightArrowIcon1/> <span> {location}</span>
    </div>
  )
}

export default NavRoute