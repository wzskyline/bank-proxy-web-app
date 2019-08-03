"use strict";

const logger = require("../../utils/logger");
const botRule = require("./botRule");
const bocRule = require("./bocRule");
const cmbcRule = require("./cmbcRule");
const tzbRule = require("./tzbRule");

/**
 * @function
 * @param {object} chinaProxyInfo
 * @param {string} chinaProxyInfo.bankname
 * @param {string} chinaProxyInfo.hostname
 * @param {number} chinaProxyInfo.port
 * @param {EventEmitter} eventEmitter
 * @param {string} socketID
 */
module.exports = function(chinaProxyInfo, eventEmitter, socketID) {
    return {
        summary: "The rules to hack request",
        *beforeSendRequest(requestDetail) {
            switch (chinaProxyInfo.bankname) {
                case "BOT":
                    return botRule.beforeSendRequest(requestDetail, chinaProxyInfo, eventEmitter, socketID);
                case "BOC":
                    return bocRule.beforeSendRequest(requestDetail, chinaProxyInfo, eventEmitter, socketID);
                case "CMBC":
                    return cmbcRule.beforeSendRequest(requestDetail, chinaProxyInfo, eventEmitter, socketID);
                case "TZB":
                    return tzbRule.beforeSendRequest(requestDetail, chinaProxyInfo, eventEmitter, socketID);
                default:
                    // Use default request if not match any domain
                    return requestDetail;
            }
        },
        *beforeSendResponse(requestDetail, responseDetail) {
            // console.log("Response Headers: " + JSON.stringify(responseDetail.response.header));
        },
        *beforeDealHttpsRequest(requestDetail, responseDetail) {
            return true;
        },
        *onError(requestDetail, error) {
            //logger.error(requestDetail);
            //logger.error(error);
        },
        *onConnectError(requestDetail, error) {
            //logger.error(requestDetail);
            //logger.error(error);
        }
    };
};
