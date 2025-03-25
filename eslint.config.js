import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier/flat";
import reactPlugin from "eslint-plugin-react";
import * as reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: ["dist/"],
	},
	eslint.configs.recommended,
	tseslint.configs.recommended,
	tseslint.configs.stylistic,
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	reactHooksPlugin.configs["recommended-latest"],
	prettierConfig,
	{
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			eqeqeq: ["error", "always", { null: "ignore" }],
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"react/prop-types": "off",
		},
	},
);
