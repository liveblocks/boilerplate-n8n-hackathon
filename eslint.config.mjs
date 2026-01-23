import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const config = [
  ...nextConfig,
  prettierConfig,
  {
    rules: {
      // This rule flags useMemo-wrapped motion.create() as creating components during render,
      // but useMemo ensures the component is stable across renders. Keep as warning.
      "react-hooks/static-components": "warn",
    },
  },
];

export default config;
