const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();
module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: process.env.BACKEND_URL || "https://dev.metahkg.org",
            changeOrigin: true,
        })
    );
};
