# Localization pipeline

English is the source catalog at `public/locales/en/translation.json`. Weblate-compatible target catalogs live beside it under their BCP 47 language code.

- `npm run i18n:extract` synchronizes missing source entries into target catalogs for translation.
- `npm run i18n:check` fails when a statically referenced key is absent from English or a target catalog is incomplete.
- `npm run i18n:translate` fills untranslated entries through LibreTranslate. Set `LIBRETRANSLATE_URL` and, when required, `LIBRETRANSLATE_API_KEY`.
- `npm run build` runs TypeScript, catalog validation, and the production Vite build.

Weblate should use JSON i18next format, English as the source language, `public/locales/en/translation.json` as the source, and `public/locales/*/translation.json` as translated files. Configure Weblate's repository URL and push credentials in the Weblate project; no credentials belong in this repository.

GeoIP is an optional initial hint only. Set `VITE_GEOIP_ENDPOINT` to a same-origin endpoint backed by GeoLite2 that returns either `{ "country_code": "US" }` or `{ "country": { "iso_code": "US" } }`. The browser detector persists an explicit language selection in `localStorage` under `i18nextLng`; that selection always takes precedence over GeoIP and browser language.
