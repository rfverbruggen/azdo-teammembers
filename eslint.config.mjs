import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
	{
		files: ["**/*.ts", "**/*.tsx"],
		ignores: ["**/out", "**/dist", "**/*.d.ts"]
	},
	{
		plugins: {
			"@typescript-eslint": typescriptEslint
		},

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 6,
			sourceType: "module"
		},

		rules: {
			"@typescript-eslint/naming-convention": "warn",
			"@typescript-eslint/semi": "warn",
			curly: "warn",
			eqeqeq: "warn",
			"no-throw-literal": "warn",
			semi: "off"
		}
	}
];
