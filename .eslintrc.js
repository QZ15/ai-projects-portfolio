module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ['apps/nutfit/**/*.{ts,tsx}'],
      parserOptions: {
        project: ['apps/nutfit/tsconfig.json'],
        ecmaFeatures: { jsx: true },
      },
      plugins: ['react', 'react-native'],
      extends: [
        'plugin:react/recommended',
        'prettier',
      ],
      env: {
        browser: true,
        'react-native/react-native': true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
        'no-empty': 'off',
        'no-func-assign': 'off',
      },
    },
    {
      files: ['functions/**/*.ts'],
      parserOptions: {
        project: ['functions/tsconfig.json'],
      },
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
