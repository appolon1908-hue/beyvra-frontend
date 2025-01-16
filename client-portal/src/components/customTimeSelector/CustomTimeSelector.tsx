import { useDispatch } from 'react-redux'
import './customTimeSelector.scss'
import { SetDuration } from '@store/slices/trade'
import { useState } from 'react'

const CustomTimeSelector = ({setToggleTimeSelector}) => {
    const [toggleMenu, setToggleMenu] = useState(0)
    const dispatch = useDispatch()


    
    const quick = (
        <div className='customTimeButtonsContainer'>
        <span onClick={()=>{
            dispatch(SetDuration(5))
            setToggleTimeSelector(false);
            console.log("Setting toggleTimeSelector to false");
            
        }}>5 sec</span>
        <span onClick={()=>{
            dispatch(SetDuration(15))
            setToggleTimeSelector(false)
            
        }}>15 sec</span>
        <span onClick={()=>{
            dispatch(SetDuration(30))
            setToggleTimeSelector(false)
            
        }}>30 sec</span>
        <span onClick={()=>{
            dispatch(SetDuration(45))
            setToggleTimeSelector(false)
            
        }}>45 sec</span>
        
    </div>
    )
    const timer = (
        <div className='customTimeButtonsContainer'>
        <span onClick={()=>{
            dispatch(SetDuration(1 * 60))
            setToggleTimeSelector(false);
            console.log("Setting toggleTimeSelector to false");
            
        }}>1 min</span>
        <span onClick={()=>{
            dispatch(SetDuration(2 * 60))
            setToggleTimeSelector(false)
            
        }}>2 min</span>
        <span onClick={()=>{
            dispatch(SetDuration(5 * 60))
            setToggleTimeSelector(false)
            
        }}>5 min</span>
        <span onClick={()=>{
            dispatch(SetDuration(10 * 60))
            setToggleTimeSelector(false)
            
        }}>10 min</span>
        
    </div>
    )
    const menus = [
        quick,
        timer
     ]

  return (
    <div className="customTimeSelectorContainer" onClick={(e)=>e.stopPropagation()}>
        <h1>Trade Duration</h1>

        <div className='customTImeSelectorButtonContainer'>
            <span className={`${toggleMenu === 0 ? 'activeMenu': ''}`} onClick={()=>setToggleMenu(0)}>Quick</span>
            <span className={`${toggleMenu === 1 ? 'activeMenu': ''}`} onClick={()=>setToggleMenu(1)}>Timer</span>
        </div>
       {menus[toggleMenu]}
    </div>
  )
}

export default CustomTimeSelector