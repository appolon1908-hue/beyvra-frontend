import CustomMarkerOne from "../customMarkerOne/CustomMarkerOne";
import CustomMarkerTwo from "../customMarkerTwo/CustomMarkerTwo";
import "./Background.scss";
import { FC, useEffect, useState } from "react";



const amounts = ["1.174", "1.172", "1.170", "1.168", "1.166", "1.164"];
const times = ["17:52", "17:52:30", "17:53", "17:53:30", "17:54"];

interface BackgroundProps {
  step: number;
}

const Background: FC<BackgroundProps> = ({ step }) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const getWidthStyle = () => {
    if (windowWidth < 834 && step >= 7) {
      return "100%";
    }
    return step < 7 ? "100%" : "80%";
  };

  const getLineBlockWidthStyle = () => {
    return step >= 7 ? "120%" : "140%";
  };

  const getMLStyle = () => {
    if (windowWidth <= 834 && step >= 7) {
      return "-10px";
    }
    if (windowWidth > 834 && step >= 7) {
      return "0px";
    }
    return step >= 7 ? "-10px" : "40px";
  };

  return (
    <div className="w_background" style={{ width: getWidthStyle() }}>
      <div className="background_block">
        <div className="w_image_slide">
          <img
            className="image"
            src="welcome-icons/slide_main.png"
          //   srcSet="
          //   welcome-icons/slide_main_mobile.png 428w,
          //   welcome-icons/slide_main_tablet.png 834w,
          //   welcome-icons/slide_main.png 1200w
          // " 
          //  sizes="(max-width: 428px) 100vw, (max-width: 834px) 834px, 1200px"
            alt=""
          />
        </div>

       

        <div className="b_right_side">
          <div className="right_side">
            {step === 3 && (
              <div className="step_three">
                <div className="line_block" style={{ width: getLineBlockWidthStyle() }}>
                  <img src="welcome-icons/romb.svg" />
                  <div className="line"></div>
                  <div className="amount_romb">1.1698</div>
                  <img
                    className="vector_up"
                    src="welcome-icons/vector_up.png"
                    alt=""
                  />
                  <img
                    className="vector_down"
                    src="welcome-icons/vector_down.png"
                    alt=""
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step_three">
                <div className="line_block" style={{ width: getLineBlockWidthStyle() }}>
                  <img src="welcome-icons/romb.svg" />
                  <div className="line"></div>
                  <div className="amount_romb">1.1698</div>
                  <img
                    className="step_four_image"
                    src="welcome-icons/step_four.png"
                    alt=""
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="step_three">
                <div className="line_block" style={{ width: getLineBlockWidthStyle() }}>
                  <img src="welcome-icons/romb.svg" />
                  <div className="line"></div>
                  <div className="amount_romb">1.1698</div>
                  <img
                    className="step_four_image"
                    src="welcome-icons/step_five.png"
                    alt=""
                  />
                </div>
              </div>
            )}

            {  step >= 6 && step !== 11 && (
              <div className="step_three">
                <div className="line_block" style={{ width: getLineBlockWidthStyle() }}>
                  <img src="welcome-icons/romb.svg" />
                  <div className="line"></div>
                  <div className="amount_romb">1.1698</div>
                </div>
              </div>
            )}

            {step === 11 && (
              <div className="step_eleven">
                <div className="customMarkerOneWalkThrough">
                   <CustomMarkerOne/>
                </div>
                <div className="customMarkerTwoWalkThrough">
                   <span>+$85%</span>
                </div>
                <div className="customMarkerThreeWalkThrough">
                   <CustomMarkerTwo/>
                </div>
              </div>
            )}

          </div>

          <div className="amount_b" style={{ marginLeft: getMLStyle() }}>
              <div className="amount">
                {amounts.map((item, index) => (
                  <div key={index + item}>{item}</div>
                ))}
              </div>
          </div>
        </div>
      </div>

      <div className="times">
        {times.map((item, index) => (
          <div className="time-item" key={index + item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Background;
