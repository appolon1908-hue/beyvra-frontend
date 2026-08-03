import { Dispatch, SetStateAction, useState } from "react";
import React from "react";
import { Col, Row, Modal } from "antd";
import { Story } from "react-insta-stories/dist/interfaces";
import Slider from "components/slider/Slider";

import { useAppSelector } from "@store/hooks";
import { UserSliceState } from "@store/slices/user";

import { RightSubDrawerContent } from "../../types";
import {
  NotificationIcon2,
  ReloadIcon,
  SettingsIcon2,
} from "../../../../../assets/icons";
import StoriesModal from "./components/Stories";
import { StorieList, storiesList } from "./data";

import "./profileMenu.scss";
import PortfolioModal from "../portfolioModal/PortfolioModal";


import { useNavigate } from "react-router-dom";

import { useCookies } from 'react-cookie';
import { revokeSession } from "api/user/logout";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/user";
import { setWallets } from "@store/slices/wallet";

interface ProfileMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
  setIsRightDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileMenu: React.FunctionComponent<ProfileMenuProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
  setIsRightDrawerOpen
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [isPortolioModalOpen, setPortfolioModalOpen] = useState<boolean>(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [modalKey, setModalKey] = useState<number>(0);
  const [stories] = useState<StorieList[]>(storiesList);
  const { themeSelect } = useAppSelector(state => state.themeBg)
  const [show, setShow] = useState(false);

  const userRedux = useAppSelector(
    (state: { user: UserSliceState }) => state.user.user
  );
  const userData =
    userRedux && Object.keys(userRedux).length ? userRedux : null;

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 3.4,
    slidesToScroll: 1,
    autoplay: false,
    cssEase: "linear",
    arrows: false,
  };


  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [cookies, , removeCookie] = useCookies(['access_token', 'refresh_token']);

  const handleLogout = async () => {
    try {
      await revokeSession(cookies.access_token, cookies.refresh_token);
    } catch (error) {
      console.error("Unable to revoke the server session", error);
    }
    dispatch(setUser(null));
    dispatch(setWallets([]));
    removeCookie('access_token', { path: '/' });
    removeCookie('refresh_token', { path: '/' });
    navigate("/signIn", { replace: true });
  };


  return (
    <div className={`${themeSelect}`}>
      <button
        type="button"
        aria-label="Open notifications"
        className="headerExtraIcon"
        onClick={() => {
          setIsRightSubDrawerOpen(true);
          setIsRightSubDrawerContent("user-notifications");
        }}
      >
        <NotificationIcon2 />
      </button>
      <div className="flexTraderProfile">
        <div className="trader">
          <p className="traderHead">
            {userData?.first_name} {userData?.last_name}
          </p>
          <p className="traderBottom">
            <span className="id">ID</span>
            <span className="id-number">{userData?.trader_id}</span>
          </p>
        </div>
        <div className="reloadIcon">
          <ReloadIcon />
        </div>
      </div>
      <div className="traderInfoImages-new">
        <Slider {...settings}>
          {stories.map((item, index) => (
            <div
              className={`card ${item.background}`}
              key={item.title + index}
              onClick={() => {
                if (item?.storiesData) {
                  setModalKey((prevKey) => prevKey + 1);
                  setCurrentStoryIndex(0);
                  setSelectedStories(item?.storiesData as Story[]);
                  setModalOpen(true);
                }
              }}
            >
              <div className="image">
                <img src={item.image} />
              </div>
              <div className="text">
                <p className="textp">{item.title}</p>
                <p className="textp">{item.p2}</p>
                <p className="textp">{item.p1}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="taskCards">
        <Row gutter={[16, 16]} justify="start">
          <Col span={12}>
            <div
              onClick={() => {
                setIsRightSubDrawerOpen(true);
                setIsRightSubDrawerContent("referral-program");
              }}
              className="profileCard"
            >
              <div className="taskCard">
                <div className="taskCardIcon">
                  <img src="/menu-images/svgs/referal-link.svg" />
                </div>
                <p className="taskCardTitle">Referral Program</p>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div
              onClick={() => {
                setIsRightSubDrawerOpen(true);
                setIsRightSubDrawerContent("boost-cubes");
              }}
              className="profileCard"
            >
              <div className="taskCard">
                <div className="taskCardIcon">
                  <img src="/menu-images/svgs/boost-cubes.svg" />
                </div>
                <p className="taskCardTitle">Boost Cubes</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div
        className="settingsButton flex flex-col"
        onClick={() => {
          setPortfolioModalOpen(true);
        }}
      >
        <button className="settings">
          <span className="icon">
            <SettingsIcon2 />
          </span>
          <span className="txt">Settings</span>
        </button>

      
      </div>

      <button className="logoutbtn" onClick={() => setShow(true)}><span>Log Out </span></button>

      <Modal
        open={show}
        rootClassName="portfolioProfile" onOk={() => setShow(false)}
        onCancel={() => setShow(false)}
        footer={null}
        maskClosable={false}
        centered
      >
        <div className='confirmEmailContainer'>
          <span className='confirmEmailTitle'>Log out</span>
          <span className='confirmEmailSubTitle'>Are you sure you want to log out?</span>
          <button
            onClick={() => {
              setShow(false);
              handleLogout();
            }}
            className="confirmEmailContinueButton"
          >
            Log out
          </button>
          <button
            onClick={() => {
              setShow(false);
            }}
            className="confirmEmailCancelButton"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <StoriesModal
        open={modalOpen}
        setOpen={setModalOpen}
        closeable={false}
        stories={selectedStories}
        currentIndex={currentStoryIndex}
        modalKey={modalKey}
      />


      <PortfolioModal
        isModalOpen={isPortolioModalOpen}
        setModalOpen={setPortfolioModalOpen}
        setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
        setIsRightDrawerOpen={setIsRightDrawerOpen}


      />
    </div>
  );
};

export default ProfileMenu;
