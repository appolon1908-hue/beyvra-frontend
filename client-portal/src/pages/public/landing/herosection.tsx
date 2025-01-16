import "./landing.scss";
import SignInForm from '../signIn/SignIn';


const Herosection = () => {


  return (
    <div className="herosectionparent">

          <div
            
            className="first__bgC">
            
          </div>
          <video
            src="/heroBGVid.mp4"
            autoPlay 
            loop 
            muted 
            playsInline 
            className="first__bg">
            
          </video>


      <div className="herosection">

        <section className="leftsidehero">
          <div className="herodatacol">
            <h1 className="title"> Achieve in&nbsp;Trading Every&nbsp;Day </h1>
          </div>

          
          <ul className="herodatarow">
            <li className="lidata">
              <span className="herodatanum font-olymp">2</span>
              <p className="main-data__value">Trading Modes</p>
            </li>
            
            <li className="lidata">
              <span className="herodatanum font-olymp">0</span>
              <p className="main-data__value">Hidden Commissions</p>
            </li>
            
            <li className="lidata">
              <span className="herodatanum font-olymp">$1</span>
              <p className="main-data__value">Minimum Investment</p>
            </li>
            
            <li className="lidata">
              <span className="herodatanum font-olymp">30+</span>
              <p className="main-data__value">Analytical Tools</p>
            </li>
          </ul>



        </section>

        <section className="rightsidehero">
          <SignInForm />
        </section>
          
      </div>
      <div>
        <p className="container_scroll">
          <img data-test-component="scroll-icon" className="svg-scroll svg-scroll-animation svg-scroll--center " src="scroll-mouse.svg" alt="scroll" />
        </p>
      </div>
    </div>
  );
};


export default Herosection;
