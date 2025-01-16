import { FC } from "react";
import "./HeaderTradCalc.scss";
import { NavLink } from "react-router-dom";

interface HeaderTradCalcProps {
  titleHeader?: string;
  withRoute?: boolean
}

const items = [{
  label: "CFD Trading Calculator",
  route: "/trading/cfdTradingCalculator"
},
{
  label: "Commodities Profit Calculator",
  route: "/trading/commoditesProfitCalculator"
},
{
  label: "Forex Profit Calculator",
  route: "/trading/forexProfitCalculator"
},
{label:  "Forex Margin Calculator",
  route: "/trading/forexMarginCalculator"
}
];

export const HeaderTradCalc: FC<HeaderTradCalcProps> = ({ titleHeader, withRoute }) => {
  return (
    <div className="headerTradCalcContainer">
      {withRoute ? (
        <div className="headerTradCalcItems">
          <h2>{titleHeader}</h2>
          <div className="headerTradCalcItem">
            {items.map((item, index) => (
              <NavLink to={item.route}
                className={titleHeader === item.label ? "headerTradActive" : ""}
                key={index + item.label}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : (
        <h2>CFD Trading Calculator</h2>
      )}
    </div>
  );
};
