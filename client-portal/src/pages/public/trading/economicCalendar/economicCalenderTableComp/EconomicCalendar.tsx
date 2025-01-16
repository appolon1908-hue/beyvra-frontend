import { useState } from "react";
import EconomCalenFilters from "./economCalenFilters/EconomCalenFilters";
import EconomCalenInfo from "./economCalenInfo/EconomCalenInfo";
import "./EconomicCalendar.scss";
import { EconomicCalendarFilters } from "./types";
import { useTranslation } from "react-i18next";

const EconomicCalendarCom = () => {
  const {t} = useTranslation()
  const [filters, setFilters] = useState<EconomicCalendarFilters>({
        importance: "Filter importance",
        country: "Select Country",
        date: "Select Date",
  });

  return (
    <div className="economicCalendarContainer">
      <h2>{t("economicCalendar")}</h2>
      <EconomCalenFilters setFilters={setFilters} filters={filters} />
      <EconomCalenInfo />
    </div>
  );
};

export default EconomicCalendarCom;
