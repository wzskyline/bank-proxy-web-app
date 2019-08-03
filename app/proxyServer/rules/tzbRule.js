"use strict";

/**
 * Bank of Tianjin
 * Only need the cookie
 */
module.exports.beforeSendRequest = (requestDetail, chinaProxyOptions, eventEmitter, socketID) => {
    const newRequestOptions = requestDetail.requestOptions;
    if (requestDetail.url.indexOf("pweb/welcome.do") !== -1) {
        var cookieAndSession = {
            cookie: newRequestOptions.headers.Cookie,
            session: ""
        };
        eventEmitter.emit("gotCookieAndSession", cookieAndSession, socketID);
    }

    requestDetail.protocol = "http";
    newRequestOptions.hostname = chinaProxyOptions.hostname;
    newRequestOptions.port = chinaProxyOptions.port;
    newRequestOptions.path = requestDetail.url; // the original url
    return requestDetail;
};
