import "./landing.scss";
import { Link } from "react-router-dom";


const Explore = () => {
    

  return (
    <div className="exploreparent">
        <h1>
        Explore trading <br/> with risk-free instruments
        </h1>
        <div className="exploreCard">
            <div className="cardLeft">
                <p>
                    Demo account <br/>
                        <span> designed for practice </span>
                </p>
                <Link to="/signIn"><button type="button">Try now</button></Link>

                <Link to="/trading"><span>
                    Learn more &gt;
                </span></Link>

            </div>
            <div className="cardRight">
                <img src="demo_user_1.webp"></img>

            </div>

        </div>

    </div>
  );
};


export default Explore;
