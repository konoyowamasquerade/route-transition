const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // transform: {
  //   'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  // },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: { moduleResolution: "node" } },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  // globalSetup: ' <rootDir>/tests/setup.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // moduleNameMapper: {
  //   '#rt(.*)$': '<rootDir>/src/$1',
  // },

  // collectCoverage: true,
  // The directory where Jest should output its coverage files
  // coverageDirectory: 'coverage',
};

export default config;
