import "./landing.scss";


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
                <button>
                    Try now
                </button>

                <span>
                    Learn more &gt;
                </span>

            </div>
            <div className="cardRight">
                <img src="demo_user_1.webp"></img>

            </div>

        </div>

    </div>
  );
};


export default Explore;
