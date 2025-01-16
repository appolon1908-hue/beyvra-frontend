import { useState } from "react";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import "./joinLeagues.scss";
import StoriesModal from "../profile/components/Stories";
import { Story } from "react-insta-stories/dist/interfaces";
import { useAppSelector } from "@store/hooks";

const JoinLeaguesData = {
  storiesData: [
    {
      url: "/menu-images/stories/League-1.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/League-2.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/League-3.png",
      duration: 5000,
    },
    {
      url: "/menu-images/stories/League-4.png",
      duration: 5000,
    },
  ],
};

const JoinLeagues = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [modalKey, setModalKey] = useState<number>(0);
  const {themeSelect} = useAppSelector(state => state.themeBg)

  return (
    <div className={`${themeSelect} joinLeagues`}>
      <div className="leaguesHeader">
        <div className="coinsDiv">
          <img
            className="coinsImage"
            src="/menu-images/svgs/ThreeCoins2.svg"
            alt=""
          />
        </div>
        <img
          className="linesImage"
          src="/menu-images/svgs/EventsLines2.svg"
          alt=""
        />
      </div>
      <div className="linearGradient"></div>
      <div className="leaguesBody">
        <h2>READY TO CHALLENGE YOURSELF?</h2>
        <h1>Join Leagues</h1>
        <p>
          Earn XP to move up to the next league and get a Boost Cube as a
          reward. You can get XP by making trades using your live account
          and taking part in events.To join Leagues, make a new trade
          on a live account.
        </p>
        <PrimaryButton
          className="btnPrime"
          Title="How Do Leagues Work"
          onClick={() => {
            setModalKey((prevKey) => prevKey + 1);
            setCurrentStoryIndex(0);
            setSelectedStories(
              JoinLeaguesData.storiesData as unknown as Story[]
            );
            setModalOpen(true);
          }}
        />
      </div>
      <StoriesModal
        open={modalOpen}
        setOpen={setModalOpen}
        modalKey={modalKey}
        closeable={false}
        stories={selectedStories}
        currentIndex={currentStoryIndex}
      />
    </div>
  );
};

export default JoinLeagues;
