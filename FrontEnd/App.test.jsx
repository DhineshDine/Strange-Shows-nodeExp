import { render, screen } from "@testing-library/react";
import App from "./src/App.jsx";
import { MemoryRouter } from "react-router-dom";
import { test, expect } from 'vitest';

test("App component renders Login heading", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headingElement = screen.getByRole('heading' , { name: /login/i} ) ;
  expect(headingElement).toBeInTheDocument();
});
