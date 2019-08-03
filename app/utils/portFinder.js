"use strict";
const portfinder = require("portfinder");
const logger = require("../utils/logger");

portfinder.basePort = 30000;
portfinder.highestPort = 40000 - 1;

module.exports.getUnusedPort = async () => {
    try {
        return await portfinder.getPortPromise();
    } catch (error) {
        logger.error("Get unused port error", error);
        throw error;
    }
};
