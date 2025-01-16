import { Link } from "react-router-dom";
import { DownloadIcon } from "../../../../../assets/icons";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import "./supportMenu.scss";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { initializeLiveChat } from "api/livechat/liveChatBot";
import { useAppSelector } from "@store/hooks";

interface SupportMenuProps {}



const SupportMenu: React.FunctionComponent<SupportMenuProps> = () => {
  const openChat = ()=> {
    if(window.LiveChatWidget){
      window.LiveChatWidget.call('maximize'); //call mazimize method on the LiveChat
    }
   }

   const {themeSelect} = useAppSelector(state => state.themeBg)
  useEffect(()=> {
    initializeLiveChat()

    return () => {

    }
  }, [])
  return (
    <div className={`${themeSelect} supportMenu`}>
      <p className="supportSectionTitle">
        Support, want to get in touch? Here`s how you can reach us.
      </p>

      <Row className="firstMenuListCard" onClick={openChat}>
        <Col span={14} className="textCol">
          <h2>Chat</h2>
          <p>Out chatbot and support team are here to help</p>
        </Col>
        <Col span={3}></Col>
        <Col span={6} className="textCol2">
          <img src="/menu-images/svgs/ChatIcon.svg" alt="" />
        </Col>
      </Row>
      <Link to="/downloads">
        <MenuListCard
          className="secondMenulistCard"
          icon={<DownloadIcon />}
          title="Download"
          subtitle="Get remote support using"
        />
      </Link>
    </div>
  );
};

export default SupportMenu;
