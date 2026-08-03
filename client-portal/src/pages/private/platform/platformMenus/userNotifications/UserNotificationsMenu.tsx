import MainItemCard from "components/mainItemCard/MainItemCard";
import { useCookies } from "react-cookie";
import {
  type NotificationEvent,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationInbox,
  useNotificationSocket,
} from "api/notification/useNotificationInbox";
import "./userNotifications.scss";

const UserNotificationsMenu = () => {
  const [cookies] = useCookies(["access_token"]);
  const inbox = useNotificationInbox(cookies.access_token);
  const markRead = useMarkNotificationRead(cookies.access_token);
  const markAll = useMarkAllNotificationsRead(cookies.access_token);
  const connected = useNotificationSocket(cookies.access_token);
  const unread = (inbox.data || []).filter((item: NotificationEvent) => !item.is_read).length;

  if (inbox.isPending) return <div className="userNotificationsMenu"><p>Loading notifications…</p></div>;
  if (inbox.isError) return (
    <div className="userNotificationsMenu">
      <p>Notifications could not be loaded.</p>
      <button type="button" onClick={() => inbox.refetch()}>Try again</button>
    </div>
  );

  return (
    <section className="notification-inbox" aria-live="polite">
      <header className="notification-inbox__header">
        <span>{unread} unread · {connected ? "Live" : "Reconnecting"}</span>
        <button type="button" disabled={!unread || markAll.isPending} onClick={() => markAll.mutate()}>
          Mark all read
        </button>
      </header>
      {!inbox.data?.length ? (
        <div className="userNotificationsMenu"><p className="menuText">No notifications yet</p></div>
      ) : inbox.data.map((item: NotificationEvent) => (
        <MainItemCard
          variant={3}
          className={`notification-container${item.is_read ? " is-read" : ""}`}
          key={item.id}
        >
          <button
            type="button"
            className="userNotificationsMessageContainer"
            disabled={item.is_read || markRead.isPending}
            onClick={() => markRead.mutate(item.id)}
          >
            <span className="header">{item.title}</span>
            <span className="notification-text">{item.message}</span>
            <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time>
          </button>
        </MainItemCard>
      ))}
    </section>
  );
};

export default UserNotificationsMenu;
