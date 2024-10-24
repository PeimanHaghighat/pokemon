import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { fireEvent } from "@testing-library/react";

test("displays Pokemon Battle heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Pokemon Battle/i);
  expect(headingElement).toBeInTheDocument();
});

test("displays a message after clicking the Start Battle button", async () => {
  act(async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const startBattleButton = screen.getByText(/Start Battle/i);
    expect(startBattleButton).toBeInTheDocument();

    fireEvent.click(startBattleButton);

    const resultMessage = await screen.findByText(/beat|same power/i);
    expect(resultMessage).toBeInTheDocument();
  });
}, 10000);
