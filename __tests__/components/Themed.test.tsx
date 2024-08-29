import { Text, View } from "@/components/Themed";
import { render } from "@testing-library/react-native";
import React from "react";

describe("Themed components", () => {
  test("should render Text component", () => {
    const { getByText } = render(<Text>Text component</Text>);

    getByText("Text component");
  });

  test("should render Text component in light mode", () => {
    const { getByText } = render(
      <Text lightColor="black">Text component</Text>
    );

    getByText("Text component");
  });

  test("should render Text component in dark mode", () => {
    const { getByText } = render(<Text darkColor="white">Text component</Text>);

    getByText("Text component");
  });

  test("should render View component", () => {
    const { getByTestId } = render(<View testID="view" />);

    getByTestId("view");
  });

  test("should render View component in light mode", () => {
    const { getByTestId } = render(<View testID="view" lightColor="white" />);

    getByTestId("view");
  });

  test("should render View component in dark mode", () => {
    const { getByTestId } = render(<View testID="view" darkColor="black" />);

    getByTestId("view");
  });
});
