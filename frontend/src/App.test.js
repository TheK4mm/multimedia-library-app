import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Smoke test: with no stored token the router should land on /login
// and the login form's "Ingresar" button should render.
test("renderiza la pantalla de login cuando no hay sesión activa", async () => {
  window.history.pushState({}, "", "/login");
  render(<App />);
  await waitFor(() => {
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });
});
