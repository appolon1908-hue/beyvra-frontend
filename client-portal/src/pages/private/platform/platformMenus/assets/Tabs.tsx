import { useState } from "react";
import { Col, Row } from "antd";
import "./tabs.scss";

interface TabsProps {
  data: { value: string; title: string }[];
  onClick?: (value: string) => void;
  defaultSelected?: string;
}

const Tabs: React.FunctionComponent<TabsProps> = ({
  data,
  onClick,
  defaultSelected,
}) => {
  const [active, setActive] = useState<string>(
    defaultSelected ? defaultSelected : data[0]?.value
  );

  const onClickTab = (value: string) => {
    setActive(value);
    onClick && onClick(value);
  };

  return (
    <div className="customTabs">
      <Row className="tabsRow" gutter={[2, 2]} justify="start">
        {data?.map((tab, index) => (
          <Col className="tabsCol" span={8} key={`${tab.value + "_" + index}`}>
            <div
              onClick={() => onClickTab(tab.value)}
              className={`tabButton ${active === tab.value ? "active" : ""}`}
            >
              {tab.title}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Tabs;
