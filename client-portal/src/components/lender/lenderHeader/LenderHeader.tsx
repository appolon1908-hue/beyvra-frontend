import { BellIconLender, EyeIcon, SearchIcon } from "../../../assets/icons";
import "./lenderHeader.scss";

interface LenderHeaderProps {
  setIsRightDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LenderHeader: React.FunctionComponent<LenderHeaderProps> = ({
  setIsRightDrawerOpen,
}) => {
  return (
    <div className="lndHeadWrapper">
      <div className="leftHead">
        <div className="logo"></div>
        <p>Movement</p>
        <p>Bills</p>
      </div>
      <div className="rightHead">
        <p>Support</p>
        <div className="icon" onClick={() => setIsRightDrawerOpen(true)}>
          <SearchIcon />
        </div>
        <div className="icon">
          <EyeIcon />
        </div>
        <div className="icon">
          <BellIconLender />
        </div>
        <div className="icon userIcon">M</div>
      </div>
    </div>
  );
};

export default LenderHeader;
