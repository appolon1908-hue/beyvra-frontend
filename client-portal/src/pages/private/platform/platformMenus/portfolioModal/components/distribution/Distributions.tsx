// import Select from 'components/select/Select'
import { Select } from 'antd'
import React, { useEffect, useRef } from 'react'
import distribution from "../../../../../../../assets/portfolio/Chart.png"
import { ColorType, createChart } from 'lightweight-charts'

const Distributions = () => {
  const distributionCharRef = useRef()


  useEffect(()=> {
    

  }, [])
  return (
    <div className='py-2'>
        <div className='flex items-center justify-between'>
            <span className='text-base'>Distributions</span>

             <Select
             defaultValue={"12"}
             options={[{value: "12", label: "12 months"}]}
             />   

        </div>

        <div className='bg-red-00 my-4'>
            <img src={distribution} alt="" className="distribution w-full" />

        </div>
    </div>
  )
}

export default Distributions