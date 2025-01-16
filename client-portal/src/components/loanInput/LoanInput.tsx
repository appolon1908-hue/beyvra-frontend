import React, { FC, InputHTMLAttributes } from "react";
import "./loanInput.scss";
import { Input } from "antd";

interface LoanInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  password?: boolean;
}

const LoanInput: FC<LoanInputProps> = ({ password, children, ...props }) => {
  return (
    <div className="LoanInput">
      {password ? (
        <Input.Password placeholder="Password" />
      ) : (
        <input {...props} />
      )}
      {children}
    </div>
  );
};

export default LoanInput;
