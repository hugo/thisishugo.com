import { render } from "@testing-library/react";
import React from "react";

import Index from "../pages/index";

describe("<Index />", () => {
  test("welcome message", () => {
    const { getByText } = render(<Index />);
    const subject = getByText("Hello, this is Hugo");

    expect(subject).toBeInTheDocument();
  });

  test("photo", () => {
    const { getByAltText } = render(<Index />);

    const subject = getByAltText("photo of hugo");

    expect(subject).toHaveAttribute("src", "hugo.jpg");
  });

  test("email", () => {
    const { getByText } = render(<Index />);

    const email = "hello@thisishugo.com";
    const subject = getByText(email);

    expect(subject).toHaveAttribute("href", `mailto:${email}`);
  });
});
