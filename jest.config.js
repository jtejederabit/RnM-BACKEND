module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        "<rootDir>/tests"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "tests/.*/.*\\.spec\\.tsx?$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "json",
        "js"
    ],
};