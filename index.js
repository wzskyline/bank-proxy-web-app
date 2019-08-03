"use strict";

const socketServer = require("./app/socketServer");
const logServer = require("./app/logServer");

socketServer.start();
logServer();
