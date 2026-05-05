import js from "@eslint/js";
import security from "eslint-plugin-security";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    plugins: { security },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...security.configs.recommended.rules,
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    },
  },
];