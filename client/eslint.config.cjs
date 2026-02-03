const { defineConfig } = require('eslint/config');

const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');

const { fixupPluginRules, fixupConfigRules } = require('@eslint/compat');

const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    plugins: {
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': typescriptEslint,
    },

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
      )
    ),

    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
    },
  },
]);
