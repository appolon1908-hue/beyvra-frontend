import { describe, expect, it } from "vitest";
import { seoLandingPages, seoPageBySlug } from "./seoPages";

describe("Beyvra public SEO landing pages", () => {
  it("keeps at least twenty complete landing pages live", () => {
    expect(seoLandingPages.length).toBeGreaterThanOrEqual(20);

    for (const page of seoLandingPages) {
      expect(page.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(page.title.length).toBeGreaterThan(6);
      expect(page.description.length).toBeGreaterThan(70);
      expect(page.keyword.length).toBeGreaterThan(4);
      expect(page.hero.length).toBeGreaterThan(20);
      expect(page.proof.length).toBeGreaterThanOrEqual(3);
      expect(page.sections.length).toBeGreaterThanOrEqual(2);
      expect(page.cta.length).toBeGreaterThan(4);
    }
  });

  it("uses unique slugs that resolve through the route lookup", () => {
    const slugs = seoLandingPages.map((page) => page.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(seoPageBySlug.get(slug)?.slug).toBe(slug);
    }
  });
});
