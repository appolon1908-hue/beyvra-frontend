import { useMemo, useState } from "react";
import type { CollapseProps, DatePickerProps } from "antd";
import { Button, Collapse, DatePicker } from "antd";

import { CalendarIcon, InfoCircleIcon } from "../../../../../assets/icons";

import "../../transactions.scss";
import "./profile.scss";

export const ProfilePart = () => {
  const [isOpenCollapse, setIsOpenCollapse] = useState<boolean>(false);

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
  };

  const items: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: (
          <div className="collaps-info-control-section">
            <div className="collaps-info-title">
              <InfoCircleIcon stroke="#ffffff" />
              <p>Trading Limits</p>
            </div>

            <Button type="primary" className={"greenBtn"}>{isOpenCollapse ? "Hide" : "Show"} </Button>
          </div>
        ),
        children: (
          <div className="collaps-info-children">
            <p className="whiteColor">You have no trading limits</p>
            <span className="whiteColor">No limit reasons to display</span>
          </div>
        ),
        showArrow: false,
      },
    ],
    [isOpenCollapse]
  );



  return (
    <div>
      <div className="user-options-bar user-option-profile-part">
        <p>Date of Birth</p>
        <DatePicker
          onChange={onChange}
          size="large"
          suffixIcon={<CalendarIcon />}
        />
      </div>
      <Collapse
        items={items}
        bordered={false}
        defaultActiveKey={["1"]}
        onChange={(e) => setIsOpenCollapse(Boolean(e.length))}
      />
    </div>
  );
}

export default ProfilePart
