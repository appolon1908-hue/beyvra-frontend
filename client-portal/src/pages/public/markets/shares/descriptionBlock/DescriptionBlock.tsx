import ItemDescription from "../components/itemDescription/ItemDescription";
import "./DescriptionBlock.scss";
import { dataShared } from "./data";

const DescriptionBlock = () => {
  return (
    <div className="descriptionContainer">
      <div className="descriptionWrapper">
        {dataShared &&
          dataShared.map((item, index) => (
            <div key={index + item.index}>
              <ItemDescription item={item}  />
            </div>
          ))}
      </div>
    </div>
  );
};

export default DescriptionBlock;
