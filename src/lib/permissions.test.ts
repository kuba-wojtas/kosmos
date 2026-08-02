import { describe, expect, it } from "vitest";
import { canChangeStatus, canViewTicket, isAdmin, type SessionUser } from "./permissions";

const user: SessionUser = { id: "u1", role: "USER" };
const otherUser: SessionUser = { id: "u2", role: "USER" };
const admin: SessionUser = { id: "a1", role: "ADMIN" };

const usersTicket = { authorId: "u1" };

describe("isAdmin", () => {
  it("zwraca true dla roli ADMIN", () => {
    expect(isAdmin(admin)).toBe(true);
  });

  it("zwraca false dla roli USER", () => {
    expect(isAdmin(user)).toBe(false);
  });
});

describe("canViewTicket", () => {
  it("pozwala autorowi zobaczyc wlasne ticket", () => {
    expect(canViewTicket(user, usersTicket)).toBe(true);
  });

  it("nie pozwala innemu uzytkownikowi zobaczyc cudzego zgloszenia", () => {
    expect(canViewTicket(otherUser, usersTicket)).toBe(false);
  });

  it("pozwala adminowi zobaczyc cudze ticket", () => {
    expect(canViewTicket(admin, usersTicket)).toBe(true);
  });

  it("porownuje id autora, nie sam fakt bycia zalogowanym", () => {
    // Regresja: latwo napisac warunek, ktory przepuszcza kazdego zalogowanego.
    expect(canViewTicket({ id: "", role: "USER" }, { authorId: "" })).toBe(true);
    expect(canViewTicket({ id: "u1", role: "USER" }, { authorId: "u9" })).toBe(false);
  });
});

describe("canChangeStatus", () => {
  it("pozwala adminowi", () => {
    expect(canChangeStatus(admin)).toBe(true);
  });

  it("nie pozwala zwyklemu uzytkownikowi nawet dla wlasnego zgloszenia", () => {
    expect(canChangeStatus(user)).toBe(false);
  });
});
