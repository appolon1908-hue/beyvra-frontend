import { useEffect, useState } from "react";
import { initializeConsentMode, readConsent, saveConsent, type ConsentState } from "./tracking";
import "./seo.scss";

export default function ConsentManager() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(() => readConsent());

  useEffect(() => {
    initializeConsentMode();
    setVisible(!localStorage.getItem("beyvra_consent_v1"));
  }, []);

  const commit = (next: ConsentState) => {
    setConsent(next);
    saveConsent(next);
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible) {
    return (
      <button className="privacyFloatingButton" type="button" onClick={() => setVisible(true)}>
        Privacy
      </button>
    );
  }

  return (
    <section className="consentBanner" aria-label="Privacy preferences">
      <div>
        <strong>Beyvra privacy choices</strong>
        <p>
          We use required security cookies for login and may use analytics or advertising cookies only after your choice.
        </p>
      </div>
      {settingsOpen ? (
        <div className="consentToggles">
          <label>
            <input type="checkbox" checked={consent.functional} disabled readOnly />
            Required security and form protection
          </label>
          <label>
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={(event) => setConsent({ ...consent, analytics: event.target.checked })}
            />
            Analytics measurement
          </label>
          <label>
            <input
              type="checkbox"
              checked={consent.advertising}
              onChange={(event) => setConsent({ ...consent, advertising: event.target.checked })}
            />
            Advertising personalization
          </label>
        </div>
      ) : null}
      <div className="consentActions">
        <button type="button" onClick={() => commit(defaultDenied())}>
          Reject optional
        </button>
        <button type="button" onClick={() => setSettingsOpen(!settingsOpen)}>
          Settings
        </button>
        <button type="button" onClick={() => commit(settingsOpen ? consent : { analytics: true, advertising: true, functional: true })}>
          Accept
        </button>
      </div>
    </section>
  );
}

function defaultDenied(): ConsentState {
  return { analytics: false, advertising: false, functional: true };
}
