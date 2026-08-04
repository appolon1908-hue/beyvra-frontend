import MainItemCard from "components/mainItemCard/MainItemCard";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateWebhook,
  useDeleteWebhook,
  useTestWebhook,
  useUpdateWebhook,
  useWebhookDeliveries,
  useWebhooks,
  type WebhookDelivery,
  type WebhookSubscription,
} from "api/notification/useWebhooks";
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
  const webhooks = useWebhooks(cookies.access_token);
  const createWebhook = useCreateWebhook(cookies.access_token);
  const updateWebhook = useUpdateWebhook(cookies.access_token);
  const deleteWebhook = useDeleteWebhook(cookies.access_token);
  const testWebhook = useTestWebhook(cookies.access_token);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [webhookCategories, setWebhookCategories] = useState("TRADE,DEPOSIT,WITHDRAWAL,SECURITY");
  const [expandedWebhook, setExpandedWebhook] = useState<string | undefined>();
  const notifications = inbox.data?.pages.flatMap((page) => page.results) ?? [];
  const unread = notifications.filter((item: NotificationEvent) => !item.is_read).length;

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
      {!notifications.length ? (
        <div className="userNotificationsMenu"><p className="menuText">No notifications yet</p></div>
      ) : notifications.map((item: NotificationEvent) => (
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
      {inbox.hasNextPage ? (
        <button
          type="button"
          className="notification-inbox__load-more"
          disabled={inbox.isFetchingNextPage}
          onClick={() => inbox.fetchNextPage()}
        >
          {inbox.isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      ) : null}
      <section className="webhook-integrations" aria-labelledby="webhook-title">
        <h2 id="webhook-title">Webhook integrations</h2>
        <p className="webhook-help">Receive signed notification events at your HTTPS endpoint.</p>
        <form onSubmit={(event) => {
          event.preventDefault();
          createWebhook.mutate({ url: webhookUrl.trim(), secret: webhookSecret, categories: webhookCategories.split(",").map((item) => item.trim().toUpperCase()).filter(Boolean) }, {
            onSuccess: (created) => { setWebhookUrl(""); setWebhookSecret(""); toast.success(`Webhook connected: ${created.url}`); },
            onError: (error) => toast.error(error instanceof Error ? error.message : "Webhook could not be saved"),
          });
        }}>
          <input aria-label="Webhook HTTPS URL" type="url" required placeholder="https://your-service.example/webhooks" value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} />
          <input aria-label="Webhook signing secret" type="password" required minLength={16} placeholder="Signing secret (16+ characters)" value={webhookSecret} onChange={(event) => setWebhookSecret(event.target.value)} />
          <input aria-label="Webhook event categories" type="text" placeholder="TRADE,DEPOSIT,SECURITY" value={webhookCategories} onChange={(event) => setWebhookCategories(event.target.value)} />
          <button type="submit" disabled={createWebhook.isPending}>{createWebhook.isPending ? "Saving…" : "Add webhook"}</button>
        </form>
        {webhooks.isPending ? <p>Loading webhook integrations…</p> : null}
        {webhooks.isError ? <p role="alert">Webhook integrations could not be loaded.</p> : null}
        {(webhooks.data ?? []).map((webhook: WebhookSubscription) => (
          <WebhookRow
            key={String(webhook.id)}
            webhook={webhook}
            expanded={expandedWebhook === webhook.id}
            onExpand={() => setExpandedWebhook(expandedWebhook === webhook.id ? undefined : webhook.id)}
            onToggle={() => updateWebhook.mutate({ id: webhook.id, is_active: !webhook.is_active }, { onSuccess: () => toast.success(webhook.is_active ? "Webhook disabled" : "Webhook enabled"), onError: () => toast.error("Webhook status could not be changed") })}
            onDelete={() => { if (window.confirm("Delete this webhook integration?")) deleteWebhook.mutate(webhook.id, { onSuccess: () => toast.success("Webhook deleted"), onError: () => toast.error("Webhook could not be deleted") }); }}
            onTest={() => testWebhook.mutate(webhook.id, { onSuccess: () => toast.success("Test webhook queued"), onError: () => toast.error("Test webhook could not be queued") })}
            busy={updateWebhook.isPending || deleteWebhook.isPending || testWebhook.isPending}
            token={cookies.access_token}
          />
        ))}
      </section>
    </section>
  );
};

function WebhookRow({ webhook, expanded, onExpand, onToggle, onDelete, onTest, busy, token }: { webhook: WebhookSubscription; expanded: boolean; onExpand: () => void; onToggle: () => void; onDelete: () => void; onTest: () => void; busy: boolean; token?: string }) {
  const deliveries = useWebhookDeliveries(token, expanded ? webhook.id : undefined);
  return <article className="webhook-row">
    <div className="webhook-row__summary"><div><strong>{webhook.url}</strong><span>{webhook.is_active ? "Active" : "Disabled"} · {webhook.categories.length ? webhook.categories.join(", ") : "All events"}</span></div><button type="button" onClick={onExpand}>{expanded ? "Hide history" : "Delivery history"}</button></div>
    <div className="webhook-row__actions"><button type="button" disabled={busy} onClick={onTest}>Send test webhook</button><button type="button" disabled={busy} onClick={onToggle}>{webhook.is_active ? "Disable" : "Enable"}</button><button type="button" disabled={busy} onClick={onDelete}>Delete</button></div>
    {expanded ? <div className="webhook-deliveries">{deliveries.isPending ? <p>Loading delivery history…</p> : deliveries.isError ? <p role="alert">Delivery history could not be loaded.</p> : !deliveries.data?.length ? <p>No deliveries yet.</p> : deliveries.data.map((delivery: WebhookDelivery) => <div className="webhook-delivery" key={delivery.id}><span className={`delivery-status delivery-status--${delivery.status}`}>{delivery.status === "S" ? "Delivered" : delivery.status === "F" ? "Failed" : "Pending"}</span><span>{delivery.event.category} · {delivery.attempts} attempt{delivery.attempts === 1 ? "" : "s"}</span><span>{delivery.response_code ?? "—"}</span>{delivery.last_error ? <span className="delivery-error">{delivery.last_error}</span> : null}</div>)}</div> : null}
  </article>;
}

export default UserNotificationsMenu;
