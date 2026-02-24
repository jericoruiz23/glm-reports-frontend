import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock del router para evitar problemas de ESM en Jest.
const mockNavigate = jest.fn(({ to }) => <div>navigate:{to}</div>);
const mockUseLocation = jest.fn(() => ({ pathname: "/admin" }));

jest.mock("react-router-dom", () => ({
  Navigate: (props) => mockNavigate(props),
  useLocation: () => mockUseLocation(),
}), { virtual: true });

function renderPrivateRoute({ authValue, pathname = "/admin", allowedRoles } = {}) {
  useAuth.mockReturnValue({ user: null, initializing: false, ...authValue });
  mockUseLocation.mockReturnValue({ pathname });

  return render(
    <PrivateRoute allowedRoles={allowedRoles}>
      <div>private-content</div>
    </PrivateRoute>
  );
}

describe("PrivateRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra loader mientras initializing es true", () => {
    renderPrivateRoute({ authValue: { initializing: true } });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("redirige a /login cuando no hay usuario", () => {
    renderPrivateRoute({ authValue: { user: null, initializing: false } });
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/login", replace: true })
    );
  });

  test("redirige a /change-password cuando passwordMustChange es true", () => {
    renderPrivateRoute({
      authValue: { user: { role: "admin", passwordMustChange: true }, initializing: false },
      pathname: "/admin",
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/change-password", replace: true })
    );
  });

  test("permite acceso a /change-password cuando passwordMustChange es true", () => {
    renderPrivateRoute({
      authValue: { user: { role: "admin", passwordMustChange: true }, initializing: false },
      pathname: "/change-password",
    });

    expect(screen.getByText("private-content")).toBeInTheDocument();
  });

  test("redirige a /dashboard cuando el rol no esta permitido", () => {
    renderPrivateRoute({
      authValue: { user: { role: "viewer", passwordMustChange: false }, initializing: false },
      allowedRoles: ["admin"],
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/dashboard", replace: true })
    );
  });

  test("renderiza children cuando auth y rol son validos", () => {
    renderPrivateRoute({
      authValue: { user: { role: "admin", passwordMustChange: false }, initializing: false },
      allowedRoles: ["admin"],
    });

    expect(screen.getByText("private-content")).toBeInTheDocument();
  });
});
