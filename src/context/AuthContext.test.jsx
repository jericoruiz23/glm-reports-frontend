import "@testing-library/jest-dom";
import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import api from "../services/api";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

function AuthProbe() {
  const { user, initializing, mustChangePassword, login, logout } = useAuth();

  return (
    <div>
      {/* Expone estado del contexto para validarlo en pruebas. */}
      <div data-testid="initializing">{String(initializing)}</div>
      <div data-testid="must-change-password">{String(mustChangePassword)}</div>
      <div data-testid="user-name">{user?.name || "none"}</div>

      <button onClick={() => login("admin@test.com", "123456")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("maneja initializing y sesion inicial", async () => {
    api.get.mockResolvedValue({
      user: { name: "Carlos", role: "admin", passwordMustChange: true },
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    // Inicia en true y luego termina cuando resuelve /me.
    expect(screen.getByTestId("initializing")).toHaveTextContent("true");

    await waitFor(() => {
      expect(screen.getByTestId("initializing")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("Carlos");
    expect(screen.getByTestId("must-change-password")).toHaveTextContent("true");
    expect(api.get).toHaveBeenCalledWith("/api/auth/me");
  });

  test("login actualiza user y mustChangePassword", async () => {
    api.get.mockRejectedValue(new Error("No session"));
    api.post.mockResolvedValue({
      user: { name: "Ana", role: "admin" },
      passwordMustChange: true,
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("initializing")).toHaveTextContent("false");
    });

    await act(async () => {
      screen.getByText("login").click();
    });

    expect(api.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "admin@test.com",
      password: "123456",
    });
    expect(screen.getByTestId("user-name")).toHaveTextContent("Ana");
    expect(screen.getByTestId("must-change-password")).toHaveTextContent("true");
  });

  test("logout limpia estado aun si falla la llamada", async () => {
    api.get.mockResolvedValue({
      user: { name: "Mario", role: "admin", passwordMustChange: false },
    });
    api.post.mockRejectedValue(new Error("logout error"));

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("Mario");
    });

    await act(async () => {
      screen.getByText("logout").click();
    });

    expect(api.post).toHaveBeenCalledWith("/api/auth/logout");
    expect(screen.getByTestId("user-name")).toHaveTextContent("none");
    expect(screen.getByTestId("must-change-password")).toHaveTextContent("false");
  });
});
