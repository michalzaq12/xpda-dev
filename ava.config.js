const IS_CI_SERVER = process.env.CI


export default {
  compileEnhancements: false,
  extensions: [
    "ts"
  ],
  require: [
    IS_CI_SERVER ? "ts-node/register/transpile-only" : "ts-node/register"
  ],
  files: [
    "test/src/**/*.spec.ts"
  ],
  snapshotDir: "test/snapshots"
}
