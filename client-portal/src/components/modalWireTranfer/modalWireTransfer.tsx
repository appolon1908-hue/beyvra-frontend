import { Modal } from 'antd'
import WireTransfer from 'pages/private/platform/platformMenus/wireTransfer/WireTransfer'
import React from 'react'
import './style.scss';

interface ModalWireProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

const ModalWireTransfer: React.FC<ModalWireProps> = ({
  isModalOpen,
  setIsModalOpen
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closable={true}
      footer={null}
      maskClosable={true}
      className='wiretransferModal'
      centered
    >
      <WireTransfer />
    </Modal>
  )
}

export default ModalWireTransfer