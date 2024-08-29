import NotFoundScreen from "@/app/+not-found";
import { render } from "@testing-library/react-native";
import React from "react";

describe("<NotFoundScreen />", () => {
  test("Screen renders correctly on NotFoundScreen", () => {
    const { getByText } = render(<NotFoundScreen />);

    getByText("This screen doesn't exist.");
    getByText("Go to home screen!");
  });
});