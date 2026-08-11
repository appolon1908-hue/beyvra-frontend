import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FinancialDisabledNotice from "./FinancialDisabledNotice";

describe("FinancialDisabledNotice", () => {
  it("never claims a financial request succeeded", () => {
    const html = renderToStaticMarkup(<FinancialDisabledNotice />);
    expect(html).toContain("Real-money services are unavailable");
    expect(html).toContain("No financial request has been created");
    expect(html).not.toMatch(/successful|confirmation|provider|request id|database/i);
  });
});
