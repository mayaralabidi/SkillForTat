import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import security from "eslint-plugin-security";

export default [
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { security },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...security.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];