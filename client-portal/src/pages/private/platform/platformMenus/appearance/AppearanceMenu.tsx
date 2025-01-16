import { useState } from "react";
import {
  ClassicIcon,
  DarkIcon,
  LightIcon,
  VolumeCrossIcon,
  VolumeIcon,
} from "../../../../../assets/icons";
import BackgroundImageSelector from "../../../../../components/backgroundImageSelector/BackgroundImageSelector";
import InterfaceScale from "../../../../../components/interfaceScale/InterfaceScale";
import Select from "../../../../../components/select/Select";
import { useTranslation } from "react-i18next";

import "./appearanceMenu.scss";
import { languages } from "../../../../../constants";
import { localFlagHandler } from "../../../../../i18n/helpers";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setBgTheme } from "@store/slices/theme";

interface AppearanceMenuProps {}

const AppearanceMenu: React.FunctionComponent<AppearanceMenuProps> = () => {
  const { i18n } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] =
    useState<boolean>(false);
  const [isSoundDropdownOpen, setIsSoundDropdownOpen] =
    useState<boolean>(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] =
    useState<boolean>(false);
    const dispatch = useAppDispatch()

    const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} appearanceMenu`}>
      <InterfaceScale />

      <Select
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        onBlur={() => setIsLanguageDropdownOpen(false)}
        handleChange={(value) => i18n.changeLanguage(value)}
        label="Language"
        defaultValue={i18n.language ?? "English"}
        options={languages.map(({ value, label }) => ({
          value,
          label: (
            <div className={`${themeSelect} dropDownMenuItem`}>
              <div className="dropDownMenuItemIcon">
                <img src={localFlagHandler(value)} />
              </div>
              {label}
            </div>
          ),
        }))}
        height="height"
        background="background"
      />
      {!isLanguageDropdownOpen && (
        <>
          <Select
            onClick={() => setIsSoundDropdownOpen(!isSoundDropdownOpen)}
            label="Sound"
            defaultValue="slient"
            options={[
              {
                value: "slient",
                label: (
                  <div className="dropDownMenuItem">
                    <div className="dropDownMenuItemIcon">
                      <VolumeCrossIcon />
                    </div>
                    Slient
                  </div>
                ),
              },
              {
                value: "gambling",
                label: (
                  <div className="dropDownMenuItem">
                    <div className="dropDownMenuItemIcon">
                      <VolumeIcon />
                    </div>
                    Gambling
                  </div>
                ),
              },
              {
                value: "default",
                label: (
                  <div className="dropDownMenuItem">
                    <div className="dropDownMenuItemIcon">
                      <VolumeIcon />
                    </div>
                    Default Pack
                  </div>
                ),
              },
            ]}
            background="background"
          />
          <Select
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            label="Color theme"
            defaultValue={themeSelect}
            handleChange={(value)=> dispatch(setBgTheme(value))}
            options={[
              {
                value: "day",
                label: (
                  <div className="dropDownMenuItem">
                    <div className="dropDownMenuItemIcon">
                      <LightIcon />
                    </div>
                    <div className="dropDownMenuItemText">Day </div>
                  </div>
                ),
              },
              {
                value: "night",
                label: (
                  <div className="dropDownMenuItem">
                    <div className="dropDownMenuItemIcon">
                      <DarkIcon />
                    </div>
                    <div className="dropDownMenuItemText">Night </div>
                  </div>
                ),
              },
              // {
              //   value: "classic",
              //   label: (
              //     <div className="dropDownMenuItem">
              //       <div className="dropDownMenuItemIcon">
              //         <ClassicIcon />
              //       </div>
              //       <div className="dropDownMenuItemText">Classic </div>
              //     </div>
              //   ),
              // },
            ]}
            background="background"
          />
          <BackgroundImageSelector />
        </>
      )}
    </div>
  );
};

export default AppearanceMenu;
