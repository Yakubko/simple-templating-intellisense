module.exports = {
    rootDir: '../',
    preset: 'ts-jest',
    collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/test/__mocks__/jest.setup.js', 'jest-canvas-mock'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
        '\\.(css|less)$': '<rootDir>/test/__mocks__/styleMock.js',
    },
};
