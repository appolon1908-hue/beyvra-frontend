import { Col, Modal, Row } from "antd";
import {
  DepositsIcon2,
  InfoCircleIcon,
} from "../../../../../assets/icons";
import Input from "../../../../../components/input/Input";
import "./transferMenu.scss";
import TransferInput from "../../../../../components/transferInput/TransferInput";
import {
  FC,
  useEffect,
  useReducer,
  useState,
} from "react";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import SelectAccount from "../selectAccount/SelectAccount";
import { InitialAccountsListProps } from "../add-account/constants";
import { useAppSelector } from "@store/hooks";
import { useDispatch } from "react-redux";
import {
  setWalletToTransferFrom,
  setWalletToTransferTo,
} from "@store/slices/wallet";

interface TransferMenuProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  setIsSucsessModalOpen: any;
}

const initialState = {
  openFirstAccountSelection: false,
  openSecondAccountSelection: false,
};

const TransferMenu: FC<TransferMenuProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsSucsessModalOpen,
}) => {
  const dispatch = useDispatch();
  const { walletToTransferFrom, walletToTransferTo } = useAppSelector(
    (state) => state.wallet
  );
  const [isModalSelectAcountModalOpen, setIsModalSelectAcountModalOpen] =
    useState(false);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    initialState
  );
  const { openFirstAccountSelection, openSecondAccountSelection } = state;

  const toggleShowFirstAccountSelection = () => {
    setState({
      openFirstAccountSelection: !openFirstAccountSelection,
    });
    setIsModalSelectAcountModalOpen(true);
  };

  const toggleShowSecondAccountSelection = () => {
    setState({
      openSecondAccountSelection: !openSecondAccountSelection,
    });
    setIsModalSelectAcountModalOpen(true);
  };

  const handleFirstAccountSelection = (item: InitialAccountsListProps) => {
    dispatch(setWalletToTransferFrom(item));
    toggleShowFirstAccountSelection();
  };
  const handleSecondAccountSelection = (item: InitialAccountsListProps) => {
    dispatch(setWalletToTransferTo(item));
    toggleShowSecondAccountSelection();
  };

  useEffect(() => {
    // Clean up
    return () => {
      setState({
        ...initialState,
      });
    };
  }, []);

  const handleCancleModalSelectAcountModal = () => {
    setIsModalSelectAcountModalOpen(false);
  };

  const renderItem = () => {
    return (
      <div className="transferMenu">
        <div className="transferMenu-title">
          {'Transfer'}
        </div>
        <TransferInput
          subtitle="From"
          className="promoCodeInput"
          icon={walletToTransferFrom?.icon}
          title={walletToTransferFrom?.title}
          placeholder={walletToTransferFrom?.amount}
          suffixIcon={<InfoCircleIcon stroke="#F58615" />}
          onClick={() => {
            toggleShowFirstAccountSelection();
          }}
        />
        {walletToTransferTo?.amount ? (
          <TransferInput
            subtitle="To"
            className="promoCodeInput"
            icon={walletToTransferTo?.icon}
            title={walletToTransferTo?.title}
            placeholder={walletToTransferTo?.amount}
            suffixIcon={<InfoCircleIcon stroke="#F58615" />}
            onClick={() => {
              toggleShowSecondAccountSelection();
            }}
          />
        ) : (
          <div className="transfer-MenuListCard">
            <MenuListCard
              variant={2}
              icon={<DepositsIcon2 />}
              title="Select Account"
              onClick={() => {
                toggleShowSecondAccountSelection();
              }}
            />
          </div>
        )}

        <div className="amountInputs">
          <Row gutter={[20, 12]} justify="start">
            <Col span={12}>
              <Input
                variant={2}
                title={walletToTransferFrom?.amount ? "Amount," : ""}
                subTitle={walletToTransferFrom?.title || ""}
              />
            </Col>
            <Col span={12}>
              <Input
                variant={2}
                title={walletToTransferTo?.amount ? "Amount," : "-"}
                subTitle={walletToTransferTo?.title || ""}
              />
            </Col>
          </Row>
        </div>
        <PrimaryButton
          Title="Transfer"
          className="TransferButton"
          onClick={() => {
            setIsSucsessModalOpen(true);
          }}
        />
        {openSecondAccountSelection && (
          <Modal
            open={isModalSelectAcountModalOpen}
            onCancel={handleCancleModalSelectAcountModal}
            className="transferMenuModal"
            footer={""}
            centered
          >
            <SelectAccount
              handleCancleModalSelectAcountModal={handleCancleModalSelectAcountModal}
              hasParent
              onitemSelection={handleSecondAccountSelection}
              title='To'
            />
          </Modal>
        )}
        {openFirstAccountSelection && (
          <Modal
            open={isModalSelectAcountModalOpen}
            onCancel={handleCancleModalSelectAcountModal}
            className="transferMenuModal"
            footer={""}
            centered
          >
            <SelectAccount
              handleCancleModalSelectAcountModal={handleCancleModalSelectAcountModal}
              hasParent
              onitemSelection={handleFirstAccountSelection}
              title='From'
            />
          </Modal>
        )}
      </div>
    );
  };
  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        className="transferMenuModal"
        footer={""}
        centered
      >
        {renderItem()}
      </Modal>
    </>
  );
};

export default TransferMenu;
