import { Col, Row } from "antd";
import "./interfaceScale.scss";
import { useEffect, useState } from "react";
import { useAppSelector } from "@store/hooks";

interface InterfaceScaleProps {}

const InterfaceScale: React.FunctionComponent<InterfaceScaleProps> = () => {
  const [activeTab, selectActiveTab] = useState("1");

  useEffect(() => {
    const storedScale = localStorage.getItem("scale");

    if (storedScale) {
      selectActiveTab(storedScale);
    }
  }, []);

  const updateScale = (scale: number) => {
    const root = document.documentElement;
    root.style.fontSize = `${scale}rem`;
    localStorage.setItem("scale", scale.toString());
  };

  const {themeSelect} = useAppSelector(state => state.themeBg)

  return (
    <div className={`interfaceScale ${themeSelect}`}>
      <p className="interfaceScaleTitle">Interface scale</p>
      <Row gutter={[2, 2]} justify="start">
        <Col span={8}>
          <div
            onClick={() => {
              selectActiveTab("0.8");
              updateScale(0.8);
            }}
            className={`interfaceTab one ${
              activeTab === "0.8" ? "active" : ""
            }`}
          >
            80%
          </div>
        </Col>
        <Col span={8}>
          <div
            onClick={() => {
              selectActiveTab("0.9");
              updateScale(0.9);
            }}
            className={`interfaceTab two ${
              activeTab === "0.9" ? "active" : ""
            }`}
          >
            90%
          </div>
        </Col>
        <Col span={8}>
          <div
            onClick={() => {
              selectActiveTab("1");
              updateScale(1);
            }}
            className={`interfaceTab three ${
              activeTab === "1" ? "active" : ""
            }`}
          >
            100%
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default InterfaceScale;
