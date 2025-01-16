import { Select } from "antd";
import { StarIcon } from "../../../../../assets/icons";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import "./aiMenu.scss";
import { Dispatch, SetStateAction, useState } from "react";
import Slider from "react-slick";
import TextArea from "antd/es/input/TextArea";
import { LeftSubDrawer } from "../../types";
import { useAppSelector } from "@store/hooks";

interface AiMenuProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const AiMenu: React.FunctionComponent<AiMenuProps> = ({
  setLeftSubDrawer,
  setIsLeftSubDrawerOpen,
}) => {
  const [activeButton, setActiveButton] = useState("summary");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const {themeSelect} = useAppSelector(state => state.themeBg)

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    autoplay: false,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <div className={` ${themeSelect} aiMenu`}>
      <div className="aiMenuHeader">
        <button
          className={activeButton === "summary" ? "active" : ""}
          onClick={() => handleButtonClick("summary")}
        >
          AI Summaries
        </button>
        <button
          className={activeButton === "quickRequests" ? "active" : ""}
          onClick={() => handleButtonClick("quickRequests")}
        >
          Quick Requests
        </button>
      </div>
      <div className="aiSummary">
        <h2>
          {activeButton === "summary"
            ? "AI Asset Summary"
            : "Respond quick questions"}
        </h2>
        {activeButton === "summary" ? (
          <div className="aiSummaryBody">
            <div>
              <Select
                options={[
                  { value: "any", label: "Any profitability" },
                  { value: "25", label: "25%" },
                  { value: "50", label: "50%" },
                  { value: "85", label: "85%" },
                  { value: "100", label: "100%" },
                ]}
                placeholder="Select Asset"
              />
            </div>
            <PrimaryButton
              Title="Get Summary"
              onClick={() => {
                setLeftSubDrawer("ai-asset-summary");
                setIsLeftSubDrawerOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="RespondBody">
            <Slider {...settings}>
              <div className="RespondSlider">
                <div>
                  <StarIcon />
                </div>
                <h2>Find current price and 52-week range for Apple (AAPL)</h2>
              </div>
              <div className="RespondSlider">
                <div>
                  <StarIcon />
                </div>
                <h2>Show me the prices of Tesla's (TSLA) on Q1 Apple (TSLA)</h2>
              </div>
            </Slider>
            <TextArea
              className="textArea"
              placeholder="Include a prompt"
              rows={4}
            />
            <PrimaryButton
              className="lastBtn"
              Title="Get Response"
              onClick={() => null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMenu;
