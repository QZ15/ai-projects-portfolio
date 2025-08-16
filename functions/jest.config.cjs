module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test).ts'],
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
  moduleNameMapper: {
    '^../services/openai.js$': '<rootDir>/src/services/openai.ts',
    '^./customers.js$': '<rootDir>/src/stripe/customers.ts',
    '^../admin.js$': '<rootDir>/src/admin.ts',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
};
