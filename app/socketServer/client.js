const io = require("socket.io-client");
const ioClient = io.connect("http://127.0.0.1:8000");
//const ioClient = io.connect("http://www.bank-proxy-web-app.com");

ioClient.on("disconnect", () => {
    ioClient.close();
});

ioClient.on("proxy-server", (messageFromServer) => {
    if (messageFromServer && messageFromServer.cookie != null) {
        console.log("Got Cookie and Session");
    }
    console.log(messageFromServer);
});

ioClient.emit("proxy-client", { bankname: "TZB", hostname: "10.221.3.233", port: 8800 });
