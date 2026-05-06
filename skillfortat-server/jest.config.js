export default {
  testEnvironment: "node",
  transform: {},

  collectCoverage: true,

  collectCoverageFrom: [
    "src/**/*.js"
  ],

  coverageDirectory: "coverage",

  coverageReporters: ["lcov", "text"]
};