import { describe, expect, it } from "vitest";
import { resolveSafeRedirect } from "./safe-redirect";

const origin = "https://kosmos.app";

describe("resolveSafeRedirect", () => {
  it("odrzuca pelny adres do obcego hosta", () => {
    expect(resolveSafeRedirect("https://evil.example", origin)).toBe("/zgloszenia");
  });

  it("odrzuca adres protocol-relative", () => {
    expect(resolveSafeRedirect("//evil.example", origin)).toBe("/zgloszenia");
  });

  it("odrzuca sciezke z odwrotnym ukosnikiem, ktora parser normalizuje do protocol-relative (regresja)", () => {
    expect(resolveSafeRedirect("/\\evil.example", origin)).toBe("/zgloszenia");
  });

  it("odrzuca adres zaczynajacy sie od podwojnego odwrotnego ukosnika", () => {
    expect(resolveSafeRedirect("\\\\evil.example", origin)).toBe("/zgloszenia");
  });

  it("odrzuca schemat javascript:", () => {
    expect(resolveSafeRedirect("javascript:alert(1)", origin)).toBe("/zgloszenia");
  });

  it("odrzuca host, ktory tylko wyglada jak subdomena wlasnego originu", () => {
    expect(resolveSafeRedirect("https://kosmos.app.evil.example/x", origin)).toBe("/zgloszenia");
  });

  it("zwraca fallback dla null, undefined i pustego stringa", () => {
    expect(resolveSafeRedirect(null, origin)).toBe("/zgloszenia");
    expect(resolveSafeRedirect(undefined, origin)).toBe("/zgloszenia");
    expect(resolveSafeRedirect("", origin)).toBe("/zgloszenia");
  });

  it("przepuszcza wlasna sciezke bez zmian", () => {
    expect(resolveSafeRedirect("/zgloszenia", origin)).toBe("/zgloszenia");
  });

  it("zachowuje query string wlasnej sciezki", () => {
    expect(resolveSafeRedirect("/zgloszenia?status=new&priority=high", origin)).toBe(
      "/zgloszenia?status=new&priority=high",
    );
  });

  it("odcina fragment, bo nie jest czescia trasy wysylanej do serwera", () => {
    expect(resolveSafeRedirect("/zgloszenia#fragment", origin)).toBe("/zgloszenia");
  });
});
