module.exports = {
  root: true,
  env: { node: true, browser: true, "vue/setup-compiler-macros": true },
  extends: [
    "vue-global-api",
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript/recommended",
    "plugin:prettier/recommended",
    "@vue/eslint-config-prettier"
  ],
  globals: { defineOptions: "writable" },
  parser: "vue-eslint-parser",
  parserOptions: { parser: "@typescript-eslint/parser", sourceType: "module", ecmaVersion: 2020 },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-this-alias": "off",
    "no-console": "off",
    "no-debugger": "off",
    "prefer-template": "error",
    "prettier/prettier": "warn",
    "vue/attributes-order": ["warn", { alphabetical: true }],
    "vue/component-name-in-template-casing": ["error", "kebab-case", { registeredComponentsOnly: false, ignores: [] }],
    "vue/html-self-closing": [
      "error",
      { html: { void: "any", normal: "any", component: "always" }, svg: "always", math: "always" }
    ],
    "vue/multi-word-component-names": "off",
    "vue/no-reserved-component-names": "off",
    "vue/no-setup-props-destructure": "off",
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/v-on-event-hyphenation": ["error", "always", { autofix: true }]
  }
};
