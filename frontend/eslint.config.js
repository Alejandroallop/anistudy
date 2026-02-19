// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Component/directive selectors — allow existing kebab-case names
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      // any is acceptable in Angular projects with external APIs / legacy code
      '@typescript-eslint/no-explicit-any': 'off',

      // Allow empty functions (common in Angular lifecycle hooks & stubs)
      '@typescript-eslint/no-empty-function': 'off',

      // Allow unused vars when prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Allow non-null assertions (common with @ViewChild in Angular)
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Project uses constructor-based DI throughout — inject() pattern not required
      '@angular-eslint/prefer-inject': 'off',

      // Project uses NgModules (standalone: false) — not migrating to standalone now
      '@angular-eslint/prefer-standalone': 'off',

      // Allow type assertions and interface patterns used by Angular generated code
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/prefer-interface': 'off',

      // Allow console.log in Angular components (debugging)
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      // Accessibility rules disabled — not required for this project
    ],
    rules: {
      // Disable strict accessibility rules that would require significant HTML changes
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/alt-text': 'off',
      '@angular-eslint/template/elements-content': 'off',
      '@angular-eslint/template/valid-aria': 'off',
      // Project uses *ngFor/*ngIf structural directives — not migrating to @for/@if now
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
]);
