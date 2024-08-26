require("dotenv").config();
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
        VUE_APP_NOTION_API_KEY: process.env.VUE_APP_NOTION_API_KEY,
        VUE_APP_NOTION_DATABASE_ID: process.env.VUE_APP_NOTION_DATABASE_ID,
        DOMAIN: process.env.DOMAIN,
      },
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs"],
    },
  ],
};
