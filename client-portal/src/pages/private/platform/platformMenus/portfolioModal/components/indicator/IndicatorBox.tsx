import React from 'react'

const IndicatorBox = ({color}: {color?: string}) => {
  return (
    <div className={`h-4  w-5 ${color  ??  "bg-white"}`}>

    </div>
  )
}

export default IndicatorBox