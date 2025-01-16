import { Upload as UploadOriginal, UploadProps as AntUploadProps } from "antd";
import type { ReactNode } from "react";
import "./upload.scss";
import { UserIcon } from "../../assets/icons";

interface UploadProps extends AntUploadProps {
  placeholder?: string;
  icon?: ReactNode;
}

const Upload: React.FunctionComponent<UploadProps> = ({
  placeholder,
  icon,
  ...props
}) => {
  return (
    <UploadOriginal
      beforeUpload={() => false}
      className="upload_main"
      {...props}
    >
      <div className="uploadContainer">
        {icon ? icon : <UserIcon opacity="0.5" />}
        <span className="uploadPlaceholder">
          {placeholder ? placeholder : "Upload"}
        </span>
      </div>
    </UploadOriginal>
  );
};

export default Upload;
