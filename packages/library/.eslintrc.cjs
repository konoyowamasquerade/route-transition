module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended', //
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['warn'],
  },
  ignorePatterns: [
    'dist',
    'doc',
    '.eslintrc.js',
    'rollup.config.mjs',
    'jest.config.mjs',
    'cypress.config.ts',
  ],

  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      // parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      // plugins: ['@typescript-eslint'],
      rules: {
        // '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      files: ['*.spec.ts'],
      extends: 'plugin:jest-dom/recommended',
    },
    {
      files: ['*.cy.ts'],
      extends: ['plugin:cypress/recommended'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./cypress/tsconfig.json'],
      },
      rules: {
        'cypress/no-unnecessary-waiting': 'off',
      },
    },
  ],
};
