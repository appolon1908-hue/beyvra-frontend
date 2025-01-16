import React from "react";
import "./EconomCalenInfo.scss";
import { DataItem } from "../types";
import { columns, data } from "../data";

const EconomCalenInfo: React.FC = () => {
  const groupByIcon = (data: DataItem[]): Record<string, DataItem[]> => {
    return data.reduce((acc, item) => {
      (acc[item.icon] = acc[item.icon] || []).push(item);
      return acc;
    }, {} as Record<string, DataItem[]>);
  };

  const groupedData = groupByIcon(data);

  return (
    <div className="economCalenInfoContainer">
      <div className="economCalenInfoHeader">
        {columns.map((item, index) => (
          <h3
            style={{
              textAlign: index === 5 ? "end" : index > 2 ? "center" : "start",
              paddingLeft: index === 5 ? "10px" : "0px",
            }}
            key={index + item.key}
          >
            {item.title}
          </h3>
        ))}
      </div>
      <div className="economCalenInfoBlock">
        {Object.keys(groupedData).map((icon, index) => (
          <div key={index + icon}>
            <div>
              <h2>{groupedData[icon][0].country}</h2>
              <p>
                <span style={{ color: "#00B67A" }}>
                  {groupedData[icon][0].subPips}
                </span>
                <span>{groupedData[icon][0].subTitle}</span>
              </p>
            </div>
            {groupedData[icon].map((item, index) => (
              <div
                key={index + item.key}
                style={{
                  background:
                    index === 0
                      ? "rgba(55, 63, 76, 0.4)"
                      : "rgba(60, 70, 85, 0.4)",
                }}
                className="economCalenInfoItem"
              >
                <span>
                  <img src={item.iconSvg} alt="" />
                  {item.icon}
                </span>
                <span>{item.recency}</span>
                <span>{item.event}</span>
                <span style={{ textAlign: "center" }}>
                  <img src={item.setAlert} alt="alert" />
                </span>
                <span className="economCalenInfoHigh">
                  <div>{item.relevance}</div>
                </span>
                <span style={{ textAlign: "end", paddingRight: "10px" }}>
                  <img src={item.exportNews} alt="alert" />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EconomCalenInfo;
