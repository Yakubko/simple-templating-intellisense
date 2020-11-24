module.exports = {
    rootDir: '../',
    preset: 'ts-jest',
    reporters: ['default', 'jest-junit'],
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
    testEnvironment: 'jsdom',
    testResultsProcessor: 'jest-junit',
    setupFilesAfterEnv: ['<rootDir>/test/__mocks__/jest.setup.js'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
        '\\.(css|less)$': '<rootDir>/test/__mocks__/styleMock.js',
    },
    reporters: ['default', ['jest-junit', { outputDirectory: './coverage' }]],
};
