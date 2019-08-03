const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.LOG_SERVER_PORT;
const fs = require("fs");
const moment = require("moment");

module.exports = () => {
    app.listen(port);
    app.use(bodyParser.json());

    app.get("/", async (_, res) => {
        res.json(await getlogFiles());
    });

    app.post("/test-proxy", async (req, res) => {
        const { host, port, path } = req.body;
        http.get({ host, port, path }, (httpResponse) => {
            httpResponse.on("data", (result) => {
                res.send(result);
            });
            httpResponse.on("error", (err) => {
                res.send(err);
            });
        });
    });

    app.get("/info/:date", async (req, res) => {
        var formatedDate = moment(req.params.date, "YYYYMMDD", true).format("YYYY-MM-DD");
        res.json(await getInfoLog(formatedDate));
    });

    app.get("/error", async (req, res) => {
        res.json(await getErrorLog());
    });
    app.get("/exception", async (req, res) => {
        res.json(await getExceptionLog());
    });

    // This must put at the end of all route
    app.get("*", async (req, res) => {
        res.json(await getlogFiles());
    });
};

async function getInfoLog(infoDate) {
    const path = __dirname + "/../../logs/info-" + infoDate + ".log";
    if (!fs.existsSync(path)) {
        return { message: "No such log" };
    }
    var result = await fs.readFileSync(path, { encoding: "utf-8" });
    return convertTextToJson(result);
}

async function getErrorLog() {
    var result = await fs.readFileSync(__dirname + "/../../logs/error.log", {
        encoding: "utf-8"
    });
    return convertTextToJson(result);
}

async function getExceptionLog() {
    var result = await fs.readFileSync(__dirname + "/../../logs/exceptions.log", {
        encoding: "utf-8"
    });
    return convertTextToJson(result);
}

async function getlogFiles() {
    var files = await fs.readdirSync(__dirname + "/../../logs", {
        encoding: "utf-8"
    });
    return {
        exampleUrl: [
            {
                info: "http://{{host}}/info/20190627",
                error: "http://{{host}}/error",
                exception: "http://{{host}}/exception"
            }
        ],
        files
    };
}

function convertTextToJson(text) {
    text = text.replace(/(\r\n|\n|\r)/gm, ",");
    text = "[" + text.substring(0, text.length - 1) + "]";
    return JSON.parse(text);
}
