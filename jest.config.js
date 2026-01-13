module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@gorhom/bottom-sheet|@tanstack|uuid|date-fns)',
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.types.ts',
    '!src/**/*.styles.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@components/(.*)$': '<rootDir>/src/shared/components/$1',
    '^@primitives/(.*)$': '<rootDir>/src/shared/components/primitives/$1',
    '^@layouts/(.*)$': '<rootDir>/src/shared/components/layouts/$1',
    '^@patterns/(.*)$': '<rootDir>/src/shared/components/patterns/$1',
    '^@hooks/(.*)$': '<rootDir>/src/shared/hooks/$1',
    '^@lib/(.*)$': '<rootDir>/src/shared/lib/$1',
    '^@styles/(.*)$': '<rootDir>/src/shared/styles/$1',
    '^@types/(.*)$': '<rootDir>/src/shared/types/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@providers/(.*)$': '<rootDir>/src/providers/$1',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  testEnvironment: 'node',
};
