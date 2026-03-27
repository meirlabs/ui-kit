import "../src/styles/index.css";
import type { Preview, Decorator } from "@storybook/react";
import React from "react";

const withTheme: Decorator = (Story) =>
  React.createElement(
    "div",
    { "data-meirlabs-theme": "dark", style: { padding: "1rem" } },
    React.createElement(Story)
  );

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0d1117" }],
    },
  },
};

export default preview;
