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
        VUE_APP_CODA_API_KEY: process.env.VUE_APP_CODA_API_KEY,
        VUE_APP_CODA_DOC_ID: process.env.VUE_APP_CODA_DOC_ID,
        VUE_APP_CODA_TABLE_ID: process.env.VUE_APP_CODA_TABLE_ID,
        DOMAIN: process.env.DOMAIN,
      },
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs"],
    },
  ],
};
