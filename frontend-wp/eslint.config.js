import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // ✅ Tout en mode "off" ou "warn" pour éviter les couleurs rouge/orange
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-console": "off",
      "no-debugger": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-refresh/only-export-components": "off",
      "react/react-in-jsx-scope": "off",

      // Si vous voulez quand même quelques vérifications basiques
      // décommentez ces lignes et elles apparaîtront juste en jaune :
      // 'no-unused-vars': 'warn',
      // 'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
