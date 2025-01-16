import { useState } from "react";
import { TimerIcon4 } from "../../../../../assets/icons";
import ArrowsSlider from "../../../../../components/arrowsSlider/ArrowsSlider";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import "./eventsSignalsClub.scss";
import { Story } from "react-insta-stories/dist/interfaces";
import StoriesModal from "../profile/components/Stories";
import { useAppSelector } from "@store/hooks";

const ReportsList = {
  storiesData: [
    {
      url: "/menu-images/stories/reports-1.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/reports-2.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/reports-3.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/reports-4.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/reports-5.png",
      duration: 5000,
    },
  ],
};

const FeatureList = {
  storiesData: [
    {
      url: "/menu-images/stories/feature-1.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/feature-2.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/feature-3.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/feature-4.png",
      duration: 5000,
    },
  ],
};

const EventsSignalsClub = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [modalKey, setModalKey] = useState<number>(0);
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} eventsSignalsClub`}>
      <div className="leaguesHeader">
        <div className="coinsDiv">
          <img className="coinsImage" src="/menu-images/svgs/Team.svg" alt="" />
        </div>
        <img
          className="linesImage"
          src="/menu-images/svgs/EventsLines2.svg"
          alt=""
        />
      </div>
      <div className="linearGradient"></div>
      <div className="leaguesBody">
        <h1>Exclusive Trading Signals Club</h1>
        <h2>480,402 PARTICIPANTS</h2>
        <p>
          Real-time signals and expert tips on how to profit during the earnings
          season. Join the club to get exclusive trading alerts from our
          analysts.
        </p>
      </div>
      <div className="timerDiv">
        <TimerIcon4 />
        <h2>ENDS ON FEB 23, 16:59</h2>
      </div>
      <ArrowsSlider>
        <div className="mainSlider">
          <div
            className="sliderDiv"
            onClick={() => {
              setModalKey((prevKey) => prevKey + 1);
              setCurrentStoryIndex(0);
              setSelectedStories(ReportsList.storiesData as unknown as Story[]);
              setModalOpen(true);
            }}
          >
            <img src="/menu-images/svgs/NewReports.svg" alt="" />
            <h2>New reports: Week #5 12/02 - 28/02</h2>
          </div>
          <div
            className="sliderDiv"
            onClick={() => {
              setModalKey((prevKey) => prevKey + 1);
              setCurrentStoryIndex(0);
              setSelectedStories(FeatureList.storiesData as unknown as Story[]);
              setModalOpen(true);
            }}
          >
            <img src="/menu-images/svgs/ClubCircle.svg" alt="" />
            <h2>Get the most out of the club</h2>
          </div>
          <div className="sliderDiv">
            <img src="/menu-images/svgs/ClubPeople.svg" alt="" />
            <h2>How works the club</h2>
          </div>
          <div className="sliderDiv">
            <img src="/menu-images/svgs/ClubTrading.svg" alt="" />
            <h2>Trading on reports: 3 tips</h2>
          </div>
        </div>
      </ArrowsSlider>
      <PrimaryButton
        className="btnPrime"
        Title="Join for Free"
        onClick={() => {}}
      />
      <StoriesModal
        open={modalOpen}
        setOpen={setModalOpen}
        modalKey={modalKey}
        closeable={true}
        stories={selectedStories}
        currentIndex={currentStoryIndex}
      />
    </div>
  );
};

export default EventsSignalsClub;
