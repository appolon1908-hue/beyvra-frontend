import { Select } from 'antd'
import React from 'react'
import './select.scss'
import icon from '../../../../../../../assets/portfolio/Ellipse 41.png'

interface selectorProps {
    options: any[]
}

const Selector: React.FC<selectorProps> = ({options}) => {
    const {Option} = Select

    return ( 
    <Select className='notify-selector'
    defaultValue="label1">

        <Option value="label1">
            <img src={icon} alt="" />
            
         </Option>
    </Select>
   

    

  )
}

export default Selector