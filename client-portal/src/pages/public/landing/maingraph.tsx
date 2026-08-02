import "./landing.scss";
import mainGR from "./mainGR.svg";

const Maingraph = () => {
    

  return (
    <div className="maingraphparent">
        
        <div className="maingraphCard">
            <div className="maingraphLeft">
                
                <img src={mainGR} alt="Trading chart illustration" className="maingraph" />
                <div className="watermarkOverlay"></div>
                
            </div>
            <div className="maingraphRight">
                <p>
                    You choose <br/>
                    the <span>amount and duration</span><br/>
                    of your trade
                </p>
                
                <h3 className="darktext">
                    Open trades starting with as little as $1 <br/>
                    with durations as low as 5 seconds
                </h3>

            </div>

        </div>

    </div>
  );
};


export default Maingraph;
