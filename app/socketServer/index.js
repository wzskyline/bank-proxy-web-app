"use strict";

const io = require("socket.io");
const events = require("events");
const ProxyServer = require("../proxyServer");
const logger = require("../utils/logger");

module.exports.start = () => {
    const server = io.listen(process.env.SOCKET_PORT);

    server.on("connection", (socket) => {
        const eventEmitter = new events.EventEmitter();

        logger.info("Socket connected");
        var newPorxyPort;
        // Set emitter here
        var proxyServer = new ProxyServer(eventEmitter, socket.id);

        // Client will send the info of proxy to china
        socket.on("proxy-client", async (chinaProxyInfo) => {
            try {
                newPorxyPort = await proxyServer.setProxyPort(chinaProxyInfo);
                proxyServer.start();
                logger.info(`Proxy Server [${newPorxyPort}] Opened.`);

                // Generate a domain
                socket.emit("proxy-server", { host: process.env.HOST || "127.0.0.1", port: newPorxyPort });
            } catch (error) {
                logger.error(error);
            }
        });

        // Waiting for proxy got the cookie and session
        eventEmitter.on("gotCookieAndSession", (cookieAndSession, socketID) => {
            const assignSocket = server.sockets.connected[socketID];
            assignSocket.emit("proxy-server", cookieAndSession);

            logger.info(cookieAndSession);

            assignSocket.disconnect();
        });

        // when socket disconnects, remove the proxy:
        socket.on("disconnect", () => {
            proxyServer.stop();
            logger.info(`Proxy Server [${newPorxyPort}] Closed.`);
            logger.info("Socket disconnected");
        });
    });
};
