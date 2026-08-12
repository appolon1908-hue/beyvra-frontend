import type { Dispatch, SetStateAction } from "react";
import type { RightSubDrawerContent } from "../../types";
import "./paymentsMenu.scss";

interface PaymentsMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const PaymentsMenu: React.FunctionComponent<PaymentsMenuProps> = () => (
  <div className="paymentsMenu" role="status">
    <h2>Money movement unavailable</h2>
    <p>Deposits, withdrawals, and transfers are disabled in this simulation-only candidate.</p>
  </div>
);

export default PaymentsMenu;
