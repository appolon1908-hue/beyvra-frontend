import { useAppDispatch, useAppSelector } from "@store/hooks";
import { StarRatingIcon } from "../../../../../assets/icons";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import "./barcode.scss";

interface BarcodeMenuProps {}

const BarcodeMenu: React.FunctionComponent<BarcodeMenuProps> = () => {
  const {themeSelect} = useAppSelector(state => state.themeBg)

  const BarcodeCardContent = () => (
    <div className="barcodeCardContent">
      <h2>Barcode</h2>
      <div className="cardTop">
        <p className="cardTitle">Active</p>
        <p className="cardTime">until 02/16/2024</p>
      </div>
      <div className="cardBottom">
        <p className="cardSubtext">0 traders purchased</p>
        <div className="cardRating">
          <p>5.0</p>
          <StarRatingIcon />
        </div>
      </div>
    </div>
  );
  return (
    <div className={`${themeSelect} barcodeMenu`}>
      <MenuListCard
        icon={<img src="/market-menu-images/BarCode.svg" alt="barcode" />}
        customContent={<BarcodeCardContent />}
      />
    </div>
  );
};

export default BarcodeMenu;
