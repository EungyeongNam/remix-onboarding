/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  server: "./server.js",
  ignoredRouteFiles: [".*"],
  // devServerBroadcastDelay: 1000,
  // serverBuildPath: "build/index.js",
};
