import { useCallback, useMemo, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";

import { TransactionPart, TradesPart, ProfilePart } from "./parts";

import "./transactions.scss";

interface TransactionsProps { }

const Transactions: React.FunctionComponent<TransactionsProps> = () => {
  const [visiableIndex, setVisiableIndex] = useState(0);
  const headers = useMemo(() => ["Transactions", "Trades", "Profile"], []);
  const { t } = useTranslation();

  const tabsBodyHandler = useCallback(() => {
    switch (visiableIndex) {
      case 0:
        return <TransactionPart />;
      case 1:
        return <TradesPart />;
      case 2:
        return <ProfilePart />;
      default:
        return <TransactionPart />;
    }
  }, [visiableIndex]);

  return (
    <div className="transactions-container">
      <ul className="tabs-headers">
        {headers.map((item, index) => (
          <li
            key={`${item}-${index}`}
            style={{
              color: index === visiableIndex ? "#FFFFFF" : "#6E6E6E",
              borderBottom:
                index === visiableIndex ? "0.125rem solid #FFFFFF" : undefined,
            }}
            onClick={() => setVisiableIndex(index)}
          >
            {t(item)}
          </li>
        ))}
      </ul>
      {tabsBodyHandler()}
    </div>
  );
};

export default withTranslation()(Transactions);
