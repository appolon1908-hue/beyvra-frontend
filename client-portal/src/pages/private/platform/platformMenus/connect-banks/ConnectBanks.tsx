import React, { Dispatch, SetStateAction } from "react";

import "./ConnectBanks.scss";

// const useStyle = createStyles(({ token }) => ({
//   "my-modal-body": {
//     background: token.blue1,
//     padding: token.paddingSM,
//   },
//   "my-modal-mask": {
//     boxShadow: `inset 0 0 15px #fff`,
//   },
//   "my-modal-header": {
//     display: "hidden"
//   },
//   "my-modal-footer": {
//     color: token.colorPrimary,
//   },
//   "my-modal-content": {
//     border: "1px solid #333",
//   },
// }));
interface ConnectBanksModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ConnectBanksModal: React.FC<ConnectBanksModalProps> = ({
  isModalOpen,
}) => {
  // const { styles } = useStyle();

  // const classNames = {
  //   body: styles["my-modal-body"],
  //   mask: styles["my-modal-mask"],
  //   header: styles["my-modal-header"],
  //   footer: styles["my-modal-footer"],
  //   content: styles["my-modal-content"],
  // };

  // const modalStyles = {
  //   body: {
  //     boxShadow: "inset 0 0 5px #999",
  //     borderRadius: 5,

  //   },
  //   mask: {
  //     backdropFilter: "blur(10px)",
  //   },
  // };

  return (
    <>{isModalOpen && <div className="connect-banks-container">ddd11</div>}</>
  );
};

export default ConnectBanksModal;
