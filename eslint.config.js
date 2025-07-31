const js = require('@eslint/js');
  const typescript = require('@typescript-eslint/eslint-plugin');
  const typescriptParser = require('@typescript-eslint/parser');
  const angular = require('@angular-eslint/eslint-plugin');
  const angularTemplate = require('@angular-eslint/template-parser');
  const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
  const prettier = require('eslint-config-prettier');

  module.exports = [
    js.configs.recommended,
    {
      files: ['**/*.ts'],
      languageOptions: {
        parser: typescriptParser,
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
          project: './tsconfig.json'
        }
      },
      plugins: {
        '@typescript-eslint': typescript,
        '@angular-eslint': angular,
      },
      rules: {
        ...typescript.configs.recommended.rules,
        ...angular.configs.recommended.rules,
        // Add your custom rules here
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@angular-eslint/component-class-suffix': 'error',
        '@angular-eslint/directive-class-suffix': 'error',
      }
    },
    {
      files: ['**/*.html'],
      languageOptions: {
        parser: angularTemplate
      },
      plugins: {
        '@angular-eslint': angular,
        '@angular-eslint/template': angularTemplatePlugin
      },
      rules: {
        '@angular-eslint/template/banana-in-box': 'error',
        '@angular-eslint/template/no-negated-async': 'error',
        '@angular-eslint/template/conditional-complexity': 'error',
        '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 8 }],
      }
    },
    prettier // This disables formatting rules that conflict with Prettier
  ];