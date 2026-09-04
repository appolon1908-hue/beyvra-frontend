import type { INotification } from "@interfaces";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateNotificationList } from "@store/slices/notification";
import { toast } from "react-toastify";

import useNotificationToggle from "api/notification/useToggleNotification";
import Toggle from "../../../../../components/toggle/Toggle";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

import EmailPreferencesPanel from "./EmailPreferencesPanel";
import "./notificationsMenu.scss";

interface NotificationsMenuProps {}

const NotificationsMenu: React.FunctionComponent<
  NotificationsMenuProps
> = () => {
  const dispatch = useAppDispatch();
  const { notificationList } = useAppSelector((state) => state.notification);
  const { mutate, isPending } = useNotificationToggle({
    onSuccess: (data) => {
      const current = notificationList.find(
        (notification) => notification.id === data.notification_id,
      );

      if (!current) return;

      dispatch(
        updateNotificationList({
          ...current,
          id: data.notification_id,
          is_enabled: data.is_enabled,
        }),
      );
    },
    onError: (error) => {
      logInternalError(error, { endpoint: "notifications.toggle" });
      toast.error(toUserSafeErrorText(error));
    },
  });

  const handleNotificationToggle = (
    data: INotification,
    isEnabled: boolean,
  ) => {
    if (!data.id) return;

    mutate({
      data: { notification_id: data.id, is_enabled: isEnabled },
    });
  };

  return (
    <div className="notificationsMenu">
      <div className="notificationsMenuSection">
        <p className="notificationsSectionTitle">
          Select the notifications you want to receive
        </p>
        {notificationList.map((notificationData) => (
          <Toggle
            key={notificationData.id}
            label={notificationData.name}
            onChange={(checked) =>
              handleNotificationToggle(notificationData, checked)
            }
            subtext={notificationData.description}
            checked={notificationData.is_enabled}
            disabled={isPending}
            infoText={
              notificationData.name === "Push Notifications"
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
