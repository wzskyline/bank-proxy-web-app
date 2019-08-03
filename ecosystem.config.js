module.exports = {
    apps: [
        {
            name: "bank-proxy-web-app",
            script: "index.js",

            // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
            // args: "one two",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "development",
                HOST: "127.0.0.1",
                SOCKET_PORT: 8000,
                LOG_SERVER_PORT: 8001
            },
            env_production: {
                NODE_ENV: "production",
                HOST: "www.bank-proxy-web-app.com",
                SOCKET_PORT: 8000,
                LOG_SERVER_PORT: 8001
            }
        }
    ]
};
