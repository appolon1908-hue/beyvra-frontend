import { INotification } from "@interfaces";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateNotificationList } from "@store/slices/notification";
import useNotificationToggle from "api/notification/useToggleNotification";
import Toggle from "../../../../../components/toggle/Toggle";
import { useCookies } from "react-cookie";

import EmailPreferencesPanel from "./EmailPreferencesPanel";
import "./notificationsMenu.scss";

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
    onError: (_error) => {},
  });

  const handleNotificationToggle = (
    data: INotification,
    isEnabled: boolean,
  ) => {
    mutate({
      data: { notification_id: data?.id, is_enabled: isEnabled },
      token: cookies.access_token,
    });
  };

  return (
    <div className="notificationsMenu">
      <div className="notificationsMenuSection">
        <p className="notificationsSectionTitle">
          Select the notifications you want to receive
        </p>
        {notificationList.map((notificationData: INotification) => (
          <Toggle
            key={notificationData.id}
            label={notificationData?.name}
            onChange={(checked) =>
              handleNotificationToggle(notificationData, checked)
            }
            subtext={notificationData?.description}
            defaultChecked={notificationData?.is_enabled}
            disabled={isPending}
            infoText={
              notificationData?.name === "Push Notifications"
                ? "Why should I receive them?"
                : ""
            }
          />
        ))}
      </div>

      <div className="notificationsMenuSection">
        <EmailPreferencesPanel />
      </div>
    </div>
  );
};

export default NotificationsMenu;
