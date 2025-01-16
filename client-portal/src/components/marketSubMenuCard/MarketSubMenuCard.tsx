import { Col, Row } from "antd";
import MainItemCard from "../mainItemCard/MainItemCard";
import "./marketSubMenuCard.scss";
import { StarRatingBlueIcon } from "../../assets/icons";
import { useAppSelector } from "@store/hooks";

const MarketSubMenuCard = ({
  img,
  title,
  rating,
  price,
  total,
  month,
  white,
}: {
  img: string;
  title: string;
  rating: string;
  price?: string;
  total: string;
  month?: boolean;
  white?: boolean;
}) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} marketSubMenuCard`}>
      <MainItemCard variant={3} className="marketSubCard">
        <Row className="marketSubRow">
          <Col sm={2} md={6} className="marketSubCol1">
            <img src={img} alt="" />
          </Col>
          <Col span={1}></Col>
          <Col sm={21} md={16} className="marketSubCol2">
            <div className="starRating">
              <h2>{title}</h2>
              <div className="starRatingNumber">
                <p>{rating}</p> <StarRatingBlueIcon />
              </div>
            </div>
            {price ? (
              <h3>
                ${price} {month ? "" : <span>/ Month</span>}
              </h3>
            ) : (
              <h3 className={`${white ? "white" : ""}`}>Free</h3>
            )}
            <h4>{total}</h4>
          </Col>
        </Row>
      </MainItemCard>
    </div>
  );
};

export default MarketSubMenuCard;
