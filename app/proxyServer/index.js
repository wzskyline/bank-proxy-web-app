"use strict";

const AnyProxy = require("anyproxy");
const { exec } = require("child_process");
const portFinder = require("../utils/portFinder");
const logger = require("../utils/logger");

const options = {
    dangerouslyIgnoreUnauthorized: true,
    webInterface: false,
    throttle: 10000,
    wsIntercept: false, // 不开启websocket代理
    silent: process.env.NODE_ENV === "production"
};

class ProxyServer {
    /**
     * @param {EventEmitter} eventEmitter - Use this eventEimtter to let proxy server emit event when got the cookie and session
     */
    constructor(eventEmitter, socketID) {
        this.proxyServer = "";
        this.eventEmitter = eventEmitter;
        this.socketID = socketID;
    }

    /**
     *
     * @param {object} chinaProxyInfo
     * @param {string} chinaProxyInfo.bankname
     * @param {string} chinaProxyInfo.hostname
     * @param {number} chinaProxyInfo.port
     */
    async setProxyPort(chinaProxyInfo) {
        try {
            const newProxyPort = await portFinder.getUnusedPort();
            options.port = newProxyPort;
            options.rule = require("./rules")(chinaProxyInfo, this.eventEmitter, this.socketID);
            return newProxyPort;
        } catch (error) {
            throw error;
        }
    }

    start() {
        this.proxyServer = new AnyProxy.ProxyServer(options);

        this._checkRootCAFileExists();
        this.proxyServer.on("ready", () => {});
        this.proxyServer.on("error", (e) => {
            logger.error(e);
        });
        this.proxyServer.start();
    }

    stop() {
        if (this.proxyServer.status === "READY") this.proxyServer.close();
    }

    /**
     * Set Certification to decrypt the https request
     */
    _checkRootCAFileExists() {
        if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
            AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
                // let users to trust this CA before using proxy
                if (!error) {
                    const certDir = require("path").dirname(keyPath);
                    logger.info("The cert is generated at", certDir);
                    const isWin = /^win/.test(process.platform);
                    if (isWin) {
                        exec("start .", { cwd: certDir }, (error, stdout, stderr) => {
                            if (error) logger.error(error);
                            else logger.info(stdout);
                        });
                        exec(`certutil.exe -addstore "Root" "rootCA.crt"`, { cwd: certDir }, (error, stdout) => {
                            if (error) logger.error(error);
                            else logger.info(stdout);
                        });
                    } else {
                        exec("open .", { cwd: certDir });
                    }
                } else {
                    logger.error("error when generating rootCA", error);
                }
            });
        }
    }
}

module.exports = ProxyServer;
