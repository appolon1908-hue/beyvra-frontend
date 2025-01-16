import { useAppSelector } from "@store/hooks";
import { setFinished } from "@store/slices/trade";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const CountDown:React.FC<{time: number,color?:string}> = ({time,color:colorProps}) => {

     // minutes

    const minuteToUnixTimeStamp = (t:number) => {
        const unix = Math.floor(Date.now() / 1000);
        const minutesToSeconds = t * 60;
        return unix + minutesToSeconds;
    };

    const [endTime, setEndTime] = useState(minuteToUnixTimeStamp(time));
    const [timeLeft, setTimeLeft] = useState(time * 60);
    const {finished} = useAppSelector((state)=>state.trades)
    const dispatch = useDispatch()

    useEffect(() => {
        if (finished) return;

        const timerId = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const remaining = endTime - now;

            if (remaining <= 0) {
                dispatch(setFinished(true));
                setTimeLeft(0);
                clearInterval(timerId);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [endTime, finished]);

const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `Wait for the result of the trade (${mins} : ${secs < 10 ? '0' : ''}${secs})`;
};
  return (
    <div className="bg-red-800 h-screen w-screen flex justify-center items-center absolute top-0">
        <div style={{color: colorProps ? colorProps : 'black'}}>
            {finished ? '': <p>{formatTime()}</p>}
        </div>
        
    </div>
  )
}

export default CountDown
