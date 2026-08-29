import { useEffect } from "react";

type SeoHeadProps = {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  jsonLd?: Record<string, unknown>;
};

function setMeta(name: string, value: string, attribute = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = value;
}

export default function SeoHead({ title, description, canonicalPath, keywords, jsonLd }: SeoHeadProps) {
  useEffect(() => {
    const siteTitle = `${title} | Beyvra`;
    const canonical = `https://beyvra.com${canonicalPath}`;
    document.title = siteTitle;
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("og:title", siteTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("twitter:card", "summary_large_image");

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    document.head.querySelectorAll('script[data-beyvra-jsonld="true"]').forEach((node) => node.remove());
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.beyvraJsonld = "true";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [canonicalPath, description, jsonLd, keywords, title]);

  return null;
}
