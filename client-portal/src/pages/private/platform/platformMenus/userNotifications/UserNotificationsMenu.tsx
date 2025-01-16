import MainItemCard from "components/mainItemCard/MainItemCard";
import "./userNotifications.scss";
import { useAppSelector } from "@store/hooks";
import { NotificationType } from "@store/slices/notification";

interface UserNotificationsMenuProps { }

const UserNotificationsMenu: React.FunctionComponent<
  UserNotificationsMenuProps
> = () => {
  const data: NotificationType[] = useAppSelector(state => state.notification.notificationList);

  return (
    <>
      {data.length === 0 ? <div className="userNotificationsMenu">
        <p className="menuText">No New Notifications</p>
      </div>
        :
        <>
          {data.map((item) => (
            <MainItemCard variant={3} className="notification-container" key={Math.random().toString()}>
              <div className="userNotificationsMessageContainer">
                <h4 className="header">{item.name}</h4>
                <p className="notification-text">{item.description}</p>
              </div>
            </MainItemCard>
          ))}
        </>
      }
    </>
  );
};

export default UserNotificationsMenu;
