import { getApiUrl } from "utils/env";
import { apiEndpoints } from "api/endpoints";

export type ConsentState = {
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
};

const CONSENT_KEY = "beyvra_consent_v1";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function defaultConsent(): ConsentState {
  return { analytics: false, advertising: false, functional: true };
}

export function readConsent(): ConsentState {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONSENT_KEY) || "");
    return { ...defaultConsent(), ...parsed };
  } catch {
    return defaultConsent();
  }
}

export function saveConsent(consent: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  applyGoogleConsent(consent);
}

export function applyGoogleConsent(consent: ConsentState) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtagFallback(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.advertising ? "granted" : "denied",
    ad_user_data: consent.advertising ? "granted" : "denied",
    ad_personalization: consent.advertising ? "granted" : "denied",
    functionality_storage: consent.functional ? "granted" : "denied",
    security_storage: "granted",
  });
}

export function initializeConsentMode() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtagFallback(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  applyGoogleConsent(readConsent());
}

export async function submitLead(payload: Record<string, unknown>) {
  const response = await fetch(getApiUrl(apiEndpoints.public.intake), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-ID": crypto.randomUUID(),
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof body?.error?.code === "string" ? body.error.code : "LEAD_SUBMISSION_FAILED");
  }
  return body;
}

export function trackPublicEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  const consent = readConsent();
  if (!consent.analytics) return;
  window.gtag?.("event", eventName, {
    event_category: "public_site",
    ...metadata,
  });
}
