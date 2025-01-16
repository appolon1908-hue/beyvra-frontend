import "./landing.scss";
import mainGR2 from "./mainGR2.svg";


const Onyourway = () => {
    

  return (
    <div className="onyourwayparent">
        <h1>
            On your way <br/>to confident trading
        </h1>
        <div className="cardContainer">
            <div className="onyourwayCard">
                
                <p>
                    Demo account 
                </p>

                <img src="demo_user_male.webp"></img>

            </div>
            <div className="onyourwayCard">
                
                <p>
                    Trading signals <span>help you <br/> 
                    notice profitable trends</span>
                </p>


                <img src={mainGR2}></img>
                

            </div>
            
        </div>


    </div>
  );
};


export default Onyourway;
