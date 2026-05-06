import { parseOfferBody } from "../controllers/offers.controller.js";

describe("parseOfferBody", () => {
  it("trims string fields", () => {
    const result = parseOfferBody({ teaches: " math ", wants: " code " });
    expect(result.teaches).toBe("math");
    expect(result.wants).toBe("code");
  });

  it("ignores undefined fields", () => {
    const result = parseOfferBody({});
    expect(result).toEqual({});
  });

  it("parses is_active correctly", () => {
    expect(parseOfferBody({ is_active: "true" }).is_active).toBe(true);
    expect(parseOfferBody({ is_active: 0 }).is_active).toBe(false);
  });
});