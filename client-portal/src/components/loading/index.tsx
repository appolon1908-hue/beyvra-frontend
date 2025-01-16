import React from "react";
import { Spin, SpinProps } from "antd";
import "./styles.scss";

interface LoadingProps extends SpinProps {}

const Loading: React.FC<LoadingProps> = ({ ...spinProps }) => {
  return (
    <div className="loading">
      <Spin {...spinProps} />
    </div>
  );
};

export default Loading;
