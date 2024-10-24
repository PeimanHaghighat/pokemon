import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("displays Pokemon Battle heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Pokemon Battle/i);
  expect(headingElement).toBeInTheDocument();
});
