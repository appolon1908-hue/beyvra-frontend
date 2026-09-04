import { toast } from "react-toastify";

import {
  type EditableEmailPreferences,
  useEmailPreferences,
  useUpdateEmailPreferences,
} from "api/notification/useEmailPreferences";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

const optionalPreferences: ReadonlyArray<{
  key: keyof EditableEmailPreferences;
  label: string;
}> = [
  { key: "trading", label: "Trading notifications" },
  { key: "funds", label: "Funds notifications" },
  { key: "statements", label: "Statement notifications" },
  { key: "support", label: "Support updates" },
];

export default function EmailPreferencesPanel() {
  const preferences = useEmailPreferences();
  const update = useUpdateEmailPreferences();

  if (preferences.isPending) {
    return <p aria-live="polite">Loading email preferences…</p>;
  }

  if (preferences.isError || !preferences.data) {
    return (
      <section aria-labelledby="email-preferences-title">
        <h2 id="email-preferences-title">Email notifications</h2>
        <p role="alert">Email preferences are temporarily unavailable.</p>
        <button type="button" onClick={() => void preferences.refetch()}>
          Try again
        </button>
      </section>
    );
  }

  const changePreference = (
    key: keyof EditableEmailPreferences,
    checked: boolean,
  ) => {
    update.mutate(
      { [key]: checked },
      {
        onError: (error) => {
          logInternalError(error, { endpoint: "notifications.email_preferences" });
          toast.error(toUserSafeErrorText(error));
        },
      },
    );
  };

  return (
    <section aria-labelledby="email-preferences-title">
      <h2 id="email-preferences-title">Email notifications</h2>
      <p>
        Account messages and security alerts are required to protect your
        account and cannot be disabled.
      </p>

      <fieldset disabled={update.isPending}>
        <legend>Email delivery preferences</legend>

        <label>
          <input type="checkbox" checked={preferences.data.account} disabled />
          Account messages
        </label>

        <label>
          <input type="checkbox" checked={preferences.data.security} disabled />
          Security alerts
        </label>

        {optionalPreferences.map(({ key, label }) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={preferences.data[key]}
              onChange={(event) => changePreference(key, event.target.checked)}
            />
            {label}
          </label>
        ))}

        <label>
          <input
            type="checkbox"
            checked={preferences.data.marketing}
            disabled
          />
          Marketing email (not available)
        </label>
      </fieldset>

      <p aria-live="polite">
        {update.isPending
          ? "Saving email preferences…"
          : update.isSuccess
            ? "Email preferences saved."
            : ""}
      </p>
    </section>
  );
}
