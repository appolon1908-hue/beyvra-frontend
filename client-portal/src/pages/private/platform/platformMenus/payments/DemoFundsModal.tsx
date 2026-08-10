import { Alert, Button, InputNumber, Modal, Select } from "antd";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { type PortfolioSummary, usePortfolioSummary } from "api/portfolio/usePortfolioSummary";
import { useDemoDeposit, useDemoWithdrawal } from "api/wallet/useDemoFunds";
import { toUserSafeErrorText } from "errors/userSafeError";

type Props = {
  mode: "deposit" | "withdraw";
  open: boolean;
  onClose: () => void;
};

export default function DemoFundsModal({ mode, open, onClose }: Props) {
  const [cookies] = useCookies(["access_token"]);
  const portfolio = usePortfolioSummary(cookies.access_token);
  const deposit = useDemoDeposit(cookies.access_token);
  const withdrawal = useDemoWithdrawal(cookies.access_token);
  const [walletId, setWalletId] = useState<number>();
  const [amount, setAmount] = useState<number>(25);
  const mutation = mode === "deposit" ? deposit : withdrawal;
  type Wallet = PortfolioSummary["wallets"][number];
  const demoWallets = portfolio.data?.wallets.filter((wallet: Wallet) => !wallet.is_real) || [];

  const submit = () => {
    if (!walletId || amount <= 0) return;
    mutation.mutate({ walletId, amount }, { onSuccess: onClose });
  };

  return (
    <Modal title={`Demo ${mode}`} open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Alert
        type="info"
        showIcon
        message="Staging demo transaction"
        description="No real funds or payment provider will be used."
      />
      <label className="demo-funds-field">
        Demo wallet
        <Select
          value={walletId}
          loading={portfolio.isPending}
          placeholder="Select a demo wallet"
          onChange={setWalletId}
          options={demoWallets.map((wallet: Wallet) => ({
            value: wallet.id,
            label: `${wallet.name} — ${wallet.currency} ${Number(wallet.balance).toFixed(2)}`,
          }))}
        />
      </label>
      <label className="demo-funds-field">
        Amount
        <InputNumber min={1} precision={2} value={amount} onChange={(value) => setAmount(value || 0)} />
      </label>
      {!portfolio.isPending && !demoWallets.length && (
        <Alert type="warning" message="No demo wallet is available." />
      )}
      {mutation.isError && <Alert type="error" message={toUserSafeErrorText(mutation.error, "wallet")} />}
      <Button
        type="primary"
        block
        loading={mutation.isPending}
        disabled={!walletId || amount <= 0}
        onClick={submit}
      >
        Confirm demo {mode}
      </Button>
    </Modal>
  );
}
