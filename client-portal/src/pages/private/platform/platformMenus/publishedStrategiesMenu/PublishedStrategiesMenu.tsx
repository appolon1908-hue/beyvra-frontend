import { useAppSelector } from "@store/hooks";
import { QuestionMarkIcon2 } from "../../../../../assets/icons";
import "./publishedStrategiesMenu.scss";

const PublishedStrategiesMenu = () => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} publishedStrategies`}>
      <div className="elipse">
        <QuestionMarkIcon2 />
      </div>
      <h2>You haven't published any strategies yet</h2>
    </div>
  );
};

export default PublishedStrategiesMenu;
