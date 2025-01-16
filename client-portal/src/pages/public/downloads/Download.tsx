import { useState } from "react";
import { Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./Download.scss";
import { ArrowLeftIcon } from "../../../assets/icons";

type UrlMappings = {
  [key: string]: {
    [key: string]: string;
  };
};

const urlsForDownload: UrlMappings = {
  anydesk: {
    Windows: "https://anydesk.com/en/downloads/thank-you?dv=win_exe",
    macOS: "https://anydesk.com/en/downloads/thank-you?dv=mac_dmg",
    "Chrome OS":
      "https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid",
    iOS: "https://itunes.apple.com/us/app/anydesk/id1176131273",
    Android:
      "https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid",
  },
  teamviewer: {
    Windows: "https://download.teamviewer.com/download/TeamViewerQS_x64.exe",
    macOS: "https://download.teamviewer.com/download/TeamViewerQS.dmg",
    "Chrome OS":
      "https://play.google.com/store/apps/details?id=com.teamviewer.quicksupport.market",
    iOS: "https://apps.apple.com/us/app/teamviewer-quicksupport/id661649585",
    Android:
      "https://play.google.com/store/apps/details?id=com.teamviewer.quicksupport.market",
  },
};

const Download = () => {
  const { t } = useTranslation();
  let navigation = useNavigate();
  const [activeTab, setActiveTab] = useState("anydesk");

  const handleClick = (value: string) => {
    const url = urlsForDownload[activeTab]?.[value];
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="downloads">
      <div onClick={() => navigation(-1)} className="go-back">
        <ArrowLeftIcon />
      </div>
      <div className="downloads-header">
        <Typography.Title className="downloads-header-title">
          {t("downloadRightVersion")}
        </Typography.Title>
        <div onClick={() => navigation(-1)} className="buttonContent">
          <button>{t("back")}</button>
        </div>
      </div>
      <div className="line-bar">
        <div className="rectangle-download-links"></div>
      </div>
      <div className="subTitle">
        <div className="downloads-platforms">{t("allPlatformsDevices")}</div>
      </div>
      {/* AnyDesk and TeamViewer links */}
      <div className="downloads-platforms-links">
        <div className="platform">
          <img
            onClick={() => setActiveTab("anydesk")}
            src="/downloads/AnydeskLogo.svg"
            alt="anydeskLogo"
          />
        </div>
        <div className="platform">
          <img
            onClick={() => setActiveTab("teamviewer")}
            src="/downloads/TeamViewerLogo.svg"
            alt="teamviewerLogo"
          />
        </div>
      </div>
      <div className="downloads-active-bar">
        <div
          className={`active-bar-line anydesk-line ${
            activeTab === "anydesk" && "active-bar"
          }`}
        ></div>
        <div
          className={`active-bar-line teamviewer-line ${
            activeTab === "teamviewer" && "active-bar"
          }`}
        ></div>
      </div>
      {/* Devices list boxes */}
      <Row className="download-devices">
        <Col
          onClick={() => handleClick("Windows")}
          className="device-container"
        >
          <div className="device-box">
            <img src="/downloads/WindowsLogo.svg" alt="windowsLogo" />
            <div className="elipse-windows"></div>
          </div>
          <p>{t("windows")}</p>
        </Col>
        <Col onClick={() => handleClick("macOS")} className="device-container">
          <div className="device-box">
            <img src="/downloads/MacosLogo.svg" alt="macOSLogo" />
            <div className="elipse-macos-1"></div>
            <div className="elipse-macos-2"></div>
          </div>
          <p>{t("macOS")}</p>
        </Col>
        <Col
          onClick={() => handleClick("Chrome OS")}
          className="device-container"
        >
          <div className="device-box">
            <img src="/downloads/ChromeLogo.svg" alt="chromeOSLogo" />
            <div className="elipse-chrome"></div>
          </div>
          <p>{t("chromeOS")}</p>
        </Col>
        <Col onClick={() => handleClick("iOS")} className="device-container">
          <div className="device-box">
            <img src="/downloads/IosLogo.svg" alt="iOSLogo" />
            <div className="elipse-ios"></div>
          </div>
          <p>{t("iOS")}</p>
        </Col>
        <Col
          onClick={() => handleClick("Android")}
          className="device-container"
        >
          <div className="device-box">
            <img src="/downloads/AndroidLogo.svg" alt="androidLogo" />
            <div className="elipse-android-1"></div>
            <div className="elipse-android-2"></div>
          </div>
          <p>{t("android")}</p>
        </Col>
      </Row>
    </div>
  );
};

export default Download;
