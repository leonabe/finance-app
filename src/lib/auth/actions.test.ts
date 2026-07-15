/**
 * Auth orchestration tests.
 * Mock only the Supabase network/client boundary — exercise real action logic.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const signInWithPasswordMock = vi.fn();
const signUpMock = vi.fn();
const signOutMock = vi.fn();
const createClientMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => createClientMock(),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    const err = new Error(`REDIRECT:${url}`);
    // @ts-expect-error test marker
    err.digest = `NEXT_REDIRECT;${url}`;
    throw err;
  },
}));

import { signInWithPassword, signUpWithPassword, signOut } from "./actions";

function form(data: Record<string, string>): FormData {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.set(k, v));
  return fd;
}

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when email/password missing on sign-in", async () => {
    createClientMock.mockResolvedValue({
      auth: { signInWithPassword: signInWithPasswordMock },
    });
    const result = await signInWithPassword(null, form({ email: "", password: "" }));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/required/i);
    expect(signInWithPasswordMock).not.toHaveBeenCalled();
  });

  it("returns configuration error when Supabase client is null", async () => {
    createClientMock.mockResolvedValue(null);
    const result = await signInWithPassword(
      null,
      form({ email: "a@b.com", password: "secret1" })
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not configured/i);
  });

  it("calls Supabase signInWithPassword and redirects on success", async () => {
    signInWithPasswordMock.mockResolvedValue({ error: null });
    createClientMock.mockResolvedValue({
      auth: { signInWithPassword: signInWithPasswordMock },
    });

    await expect(
      signInWithPassword(null, form({ email: "user@example.com", password: "secret1" }))
    ).rejects.toThrow(/REDIRECT:\//);

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret1",
    });
  });

  it("surfaces Supabase sign-in errors", async () => {
    signInWithPasswordMock.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });
    createClientMock.mockResolvedValue({
      auth: { signInWithPassword: signInWithPasswordMock },
    });

    const result = await signInWithPassword(
      null,
      form({ email: "user@example.com", password: "wrong" })
    );
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid login credentials");
  });

  it("validates password length on sign-up", async () => {
    createClientMock.mockResolvedValue({ auth: { signUp: signUpMock } });
    const result = await signUpWithPassword(
      null,
      form({ email: "a@b.com", password: "123" })
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/6 characters/i);
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("calls Supabase signUp and redirects on success", async () => {
    signUpMock.mockResolvedValue({ error: null });
    createClientMock.mockResolvedValue({ auth: { signUp: signUpMock } });

    await expect(
      signUpWithPassword(null, form({ email: "new@example.com", password: "secret1" }))
    ).rejects.toThrow(/REDIRECT:\//);

    expect(signUpMock).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "secret1",
    });
  });

  it("signOut calls supabase and redirects", async () => {
    signOutMock.mockResolvedValue({});
    createClientMock.mockResolvedValue({ auth: { signOut: signOutMock } });

    await expect(signOut()).rejects.toThrow(/REDIRECT:\//);
    expect(signOutMock).toHaveBeenCalled();
  });
});
