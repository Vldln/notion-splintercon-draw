module.exports = {
  apps: [
    {
      name: "Splintercon draw showcases",
      port: "3000",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
      env_file: "./.env",
      env: {
        NODE_ENV: "production",
      },
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs"],
    },
  ],
};
