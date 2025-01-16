import { Modal as ModalOriginal } from "antd";
import "./modal.scss";
import { CloseIcon } from "../../assets/icons";

export interface ModalProps {
  children?: React.ReactNode;
  rootClassName?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  footer?: React.ReactNode;
  closeable?: boolean;
  maskClosable?: boolean;
}

const Modal: React.FunctionComponent<ModalProps> = ({
  children,
  rootClassName,
  open,
  setOpen,
  onOk,
  onCancel,
  title,
  footer,
  closeable,
  maskClosable,
}) => {
  return (
    <ModalOriginal
      rootClassName={rootClassName}
      title={title}
      centered
      open={open}
      onOk={(e) => (onOk ? onOk(e) : setOpen(false))}
      onCancel={(e) => (onCancel ? onCancel(e) : setOpen(false))}
      footer={footer ? footer : null}
      closeIcon={<CloseIcon />}
      closable={closeable}
      maskClosable={maskClosable}
    >
      {children}
    </ModalOriginal>
  );
};

export default Modal;
