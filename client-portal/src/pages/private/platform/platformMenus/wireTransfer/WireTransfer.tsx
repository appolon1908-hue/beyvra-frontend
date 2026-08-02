import Input from "../../../../../components/input/Input";
import "./wireTransfer.scss";
import useAdminBankDetails from "api/bank/useAdminBankDetails";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const WireTransfer = () => {
  const [data, setData] = useState<{
    id: number;
    created_at: string;
    updated_at: string;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    last_name: string;
    routing_number: string;
    swift_code: string;
    iban: string;
    country: string;
  } | null>(null);
  const [cookies] = useCookies(["access_token"]);
  const { mutate } = useAdminBankDetails({
    onSuccess: (data) => {
      setData(data.data[0]);
    },
    onError: (error) => {
      console.log('##Error:: ', error);
    },
  });

  useEffect(() => {
    mutate(cookies.access_token)
  }, [cookies.access_token, mutate])

  return (

    <div className="wireTransfer">
      <h2 style={{ color: 'white' }}>Wire Transfer Details</h2>
      <div className="inputsContainer">
        <Input
          variant={2}
          title="Beneficiary Bank Name"
          disabled
          textOnly
          //value={data?.account_holder_name}
          value="WoodForest National Bank"
        />
        <Input
          variant={2}
          title="Beneficiary Name"
          disabled
          textOnly
          //value={data?.last_name}
          value="Codestra S.R.L"

        />
        <Input
          variant={2}
          title="Account Number or IBAN"
          disabled
          textOnly
          //value={data?.bank_name}
          value="1321015982"
        />
        <Input
          variant={2}
          title="Routing Number"
          disabled
          textOnly
          //value={data?.account_number}
          value="113008465"
        />
        <Input
          variant={2}
          title="SWIFT or BIC Code"
          disabled
          textOnly
          //value={data?.swift_code}
          value="WONAUS44XXX"
        />
        <Input
          variant={2}
          title="Address"
          disabled
          textOnly
          //value={data?.iban}
          value="20634 Longenbaugh Road"
        />
        <Input
          variant={2}
          title="City"
          disabled
          textOnly
          //value={data?.routing_number}
          value="TX 77433"
        />
        <Input
          variant={2}
          title="Country"
          disabled
          textOnly
          value={data?.country}
        />
      </div>
    </div>
  );
};

export default WireTransfer;