import { Col, Row } from "antd";
import "./AccountArchiveMenu.scss";
import {
  AccountEmptyIcon,
  AccountsIcon,
  SuccessIcon,
  TradesIcon2,
} from "../../../../../assets/icons";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import { Dispatch, SetStateAction } from "react";
import { RightSubDrawerContent } from "../../types";
import PrimaryButton from "components/primaryButton/PrimaryButton";
import useUpdateWallet from "api/wallet/useUpdateWallet";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@store/hooks";
import { setEditableWallet, updateWalletsArray, WalletSliceState } from "@store/slices/wallet";
import { useCookies } from "react-cookie";

interface AccountArchiveMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const AccountArchiveMenu: React.FunctionComponent<AccountArchiveMenuProps> = ({
  setIsRightSubDrawerContent,
}) => {
  const { editableWallet } = useAppSelector(
    (state: { wallet: WalletSliceState  }) => state.wallet
  );
  const dispatch = useDispatch();
  const [cookies] = useCookies(["access_token"]);

  const { mutate, isPending } = useUpdateWallet({
    onSuccess: (data) => {
      const {wallet} = data;
      dispatch(updateWalletsArray(wallet));
      dispatch(setEditableWallet({}));
      setIsRightSubDrawerContent("account-archive-success-menu");
    },
    onError: (error) => {},
  });

  const handleArchiveAccount = () => {
    mutate({
      data: {...editableWallet, is_archived: !editableWallet?.is_archived },
      id: editableWallet?.id,
      token: cookies.access_token,
      archive: true
    });
  };

  return (
    <div className="archiveMenu">
      <p className="archiveMenuText">
        Make sure all 3 of these conditions are met before you attempt to
        archive the account:
      </p>
      <Row className="archiveMenuList">
        <Col span={4}>
          <SuccessIcon width="2.011rem" height="2.011rem" />
        </Col>
        <Col span={20}>
          <div className="archiveMenuContent">
            <div className="archiveMenuItem">
              <div>
                <AccountsIcon />
              </div>
              <p>Accounts</p>
            </div>
            <p>You have more than one live account.</p>
          </div>
        </Col>
      </Row>
      <Row className="archiveMenuList">
        <Col span={4}>
          <SuccessIcon width="2.011rem" height="2.011rem" />
        </Col>
        <Col span={20}>
          <div className="archiveMenuContent">
            <div className="archiveMenuItem">
              <div>
                <AccountEmptyIcon />
              </div>
              <p>Accounts</p>
            </div>
            <p>There is no money in the account.</p>
          </div>
        </Col>
      </Row>
      <Row className="archiveMenuList">
        <Col span={4}>
          <SuccessIcon width="2.011rem" height="2.011rem" />
        </Col>
        <Col span={20}>
          <div className="archiveMenuContent">
            <div className="archiveMenuItem">
              <div>
                <TradesIcon2 />
              </div>
              <p>Trades</p>
            </div>
            <p>All trades associated with the account are closed.</p>
          </div>
        </Col>
      </Row>
      <p className="archiveMenuHelpCenter">
        For more information, please refer to the <br />
        <span>Help Center.</span>
      </p>
      <PrimaryButton
        onClick={() => {handleArchiveAccount();}}
        className="dark-btn"
        Title="Archive Account"
        loading={isPending}
      />
    </div>
  );
};

export default AccountArchiveMenu;
