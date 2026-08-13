
import Toggle from "../../../../../components/toggle/Toggle";
import "./notificationsMenu.scss";
import { INotification } from "@interfaces";
import { updateNotificationList } from "@store/slices/notification";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useCookies } from "react-cookie";
import useNotificationToggle from "api/notification/useToggleNotification";

interface NotificationsMenuProps {}

const NotificationsMenu: React.FunctionComponent<
  NotificationsMenuProps
> = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
  const { notificationList } = useAppSelector((state) => state.notification);
  const { mutate, isPending } = useNotificationToggle({
    onSuccess: (data) => {
      dispatch(updateNotificationList(data));
    },
    onError: (error) => { },
  });
  const handleNotificationToggle = (data: INotification, isEnabled: boolean) => {

    mutate({
      data: {notification_id: data?.id, is_enabled: isEnabled},
      token: cookies.access_token,
    });
  };
  return (
    <div className="notificationsMenu">
      <div className="notificationsMenuSection">
        <p className="notificationsSectionTitle">
          Select the notifications you want to receive
        </p>
        {notificationList.map((notificationData: INotification, _i: number) => (
          <Toggle
            key={_i}
            label={notificationData?.name}
            onChange={(checked) => handleNotificationToggle(notificationData, checked)}
            subtext={notificationData?.description}
            defaultChecked={notificationData?.is_enabled}
            infoText={notificationData?.name === "Push Notifications" ? "Why should I receive them?" :""}
          />
        ))}
       
      </div>
    </div>
  );
};

export default NotificationsMenu;
