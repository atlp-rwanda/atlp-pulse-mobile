import Button from "@/components/buttons";
import { render } from "@testing-library/react-native";
import React from "react";

describe("<Button />", () => {
  test("Default Button renders correctly", () => {
    const { getByText } = render(
      <Button state="Default" onPress={() => {}} title="Hello" />
    );

    getByText("Hello");
  });

  test("Hover Button renders correctly", () => {
    const { getByText } = render(
      <Button state="Hover" onPress={() => {}} title="Hello" />
    );

    getByText("Hello");
  });

  test("Pressed Button renders correctly", () => {
    const { getByText } = render(
      <Button state="Pressed" onPress={() => {}} title="Hello" />
    );

    getByText("Hello");
  });

  test("Disabled Button renders correctly", () => {
    const { getByText } = render(
      <Button state="Disabled" onPress={() => {}} title="Hello" />
    );

    getByText("Hello");
  });

  test("Outlined Button renders correctly", () => {
    const { getByText } = render(
      <Button state="Outlined" onPress={() => {}} title="Hello" />
    );

    getByText("Hello");
  });

    test("Small Button renders correctly", () => {
        const { getByText } = render(
        <Button size="sm" onPress={() => {}} title="Hello" />
        );
    
        getByText("Hello");
    });

    test("Large Button renders correctly", () => {
        const { getByText } = render(
        <Button size="lg" onPress={() => {}} title="Hello" />
        );
    
        getByText("Hello");
    });
});
