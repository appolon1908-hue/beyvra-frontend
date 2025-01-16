import { FC } from "react";
import "./ItemDescription.scss";

interface ItemDescriptionProps {
  item: {
    title: string;
    image: string;
    text: string[];
    index: number;
    sub_text?: string[];
    left?: boolean;
  };
}

const ItemDescription: FC<ItemDescriptionProps> = ({ item }) => {
  return (
    <div
      key={item.index}
      className={`itemDescriptionContainer ${
        item.index === 2 ? "reverse" : ""
      }`}
    >
      <div>
        <h2>{item.title}</h2>
        {item.text.map((text, ind) => (
          <span key={ind}>{text}</span>
        ))}

        {item.sub_text &&
          item.sub_text.map((text, ind) => (
            <span key={ind}>
              <div></div>
              {text}
            </span>
          ))}
      </div>
      <img src={item.image} alt="" />
    </div>
  );
};

export default ItemDescription;
