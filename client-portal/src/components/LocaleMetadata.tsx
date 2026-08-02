import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const supportedLocales = ["en", "ar", "de", "es", "fr", "hi", "ja"];

export default function LocaleMetadata() {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const language = i18n.resolvedLanguage || i18n.language || "en";
    document.documentElement.lang = language;
    document.documentElement.dir = i18n.dir(language);

    document.head.querySelectorAll('link[data-i18n-alternate="true"]').forEach((node) => node.remove());
    const currentUrl = new URL(window.location.href);
    for (const locale of [...supportedLocales, "x-default"]) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = locale;
      const alternateUrl = new URL(currentUrl);
      if (locale === "x-default") alternateUrl.searchParams.delete("lang");
      else alternateUrl.searchParams.set("lang", locale);
      link.href = alternateUrl.toString();
      link.dataset.i18nAlternate = "true";
      document.head.appendChild(link);
    }
  }, [i18n, i18n.resolvedLanguage, location.hash, location.pathname, location.search]);

  return null;
}
