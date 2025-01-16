import { Dispatch, FC, SetStateAction } from "react";
import "./EconomCalenFilters.scss";
import { EconomicCalendarFilters } from "../types";
import { DatePicker, Select } from "antd";
import { ArrowDownIcon } from "../icons/icons";
import { dateFormter } from "helpers/dateFormter";

interface EconomCalenFiltersProps {
  filters: EconomicCalendarFilters;
  setFilters: Dispatch<SetStateAction<EconomicCalendarFilters>>;
}

const { Option } = Select;

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Russia",
  "China",
  "India",
  "Japan",
];

const importanceLevels = ["High", "Medium", "Low"];

const EconomCalenFilters: FC<EconomCalenFiltersProps> = ({
  filters,
  setFilters,
}) => {

  const handleChangeImportanc = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      importance: value,
    }));
  };

  const handleChangeCountry = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      country: value,
    }));
  };

  const handleChangeDate = (event: any) => {
    if (event) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        date: dateFormter(event.toDate()),
      }));
    }
  };

  return (
    <div className="economCalenFiltContainer">
      <div className="economCalenFiltItem">
        <Select
          showSearch
          placeholder="Filter importance"
          optionFilterProp="children"
          onChange={handleChangeImportanc}
          filterOption={(input, option) =>
            option?.children
              ? option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
          className="custom-select"
        >
          {importanceLevels.map((level) => (
            <Option key={level} value={level}>
              {level}
            </Option>
          ))}
        </Select>
      </div>
      <div className="economCalenFiltItem">
        <Select
          showSearch
          placeholder="Select a country"
          optionFilterProp="children"
          onChange={handleChangeCountry}
          filterOption={(input, option) =>
            option?.children
              ? option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
          className="custom-select"
        >
          {countries.map((country) => (
            <Option key={country} value={country}>
              {country}
            </Option>
          ))}
        </Select>
      </div>
      <div className="economCalenFiltItem">
        <DatePicker
          size="large"
          placeholder="Start Date"
          suffixIcon={<ArrowDownIcon />}
          onChange={handleChangeDate}
          className="custom-select-data"
        />
      </div>
    </div>
  );
};

export default EconomCalenFilters;
