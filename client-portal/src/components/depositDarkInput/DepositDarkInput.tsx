import "./DepositDarkInput.scss";

const DepositDarkInput = ({
  type,
  placeholder,
}: {
  type: string;
  placeholder: string;
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="deposit-dark-input"
    />
  );
};

export default DepositDarkInput;
