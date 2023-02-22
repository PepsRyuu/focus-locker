module.exports = {
    rootDir: './',
    roots: [ '<rootDir>/src', '<rootDir>/test' ],
    setupFilesAfterEnv: ['<rootDir>/test/bootstrap.js'],
    testEnvironment: "jsdom",
    testMatch: [ '**/cases/**/*.js(x)?' ],
    transform: {
        '\\.(m)?js$': ['babel-jest', { configFile: './babelrc.json' }]
    },
    transformIgnorePatterns: []
};