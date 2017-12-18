var ws = {};
var CheckServerOpen = false;
var CheckServerClose = false;
var sendToken = false;
window.start_send = function () {
    window.data = {};
    window.data.token = document.getElementById("login-token").value;
    window.data.keyNumb = document.getElementById("login-ip").value;
    sendToken = true;
};
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
var client_IP = httpGet("https://api.ipify.org/");
function connect() {
    var ws = new WebSocket("ws://194.87.95.4:5000");
    ws.onopen = function () {
        if (CheckServerOpen == false) {
            swal({
                title: "Server",
                icon: "success",
                text: "BFAC server open!"
            });
            CheckServerOpen = true;
        }
        CheckServerClose = false;
        setInterval(function () {
            if (sendToken == true) {
                if (ws.readyState == 1) {
                    ws.send(JSON.stringify({
                        userip: client_IP,
                        data: "setBots",
                        reason: window.data
                    }))
                }
                sendToken = false;
            }
        }, 1000);
        ws.send(JSON.stringify({
            data: "getUserStatus",
            userip: client_IP
        }));
    }
    ws.onclose = function () {
        if (CheckServerClose == false) {
            swal({
                title: "Server",
                icon: "warning",
                text: "BFAC server close!"
            })
            CheckServerClose = true;
        }
        CheckServerOpen = false;
        connect();
    }
    ws.onmessage = function (message) {
        var msg = JSON.parse(message.data);
        switch (msg.data) {
            case "SendKeyReason": {
                swal({
                    title: "Key Generate Succesfull",
                    icon: "success",
                    text: `${msg.key_dat.key}`
                });
            } break;
            case "SendUserData": {
                console.log(msg.reason)
                document.getElementById("UserIP").innerHTML = client_IP;
                document.getElementById("UserTime").innerHTML = (msg.reason.time / 3600 >> 0) + ":" + (msg.reason.time / 60 % 60 >> 0) + ":" + (msg.reason.time % 60 >> 0);
                document.getElementById("UserStartTime").innerHTML = (msg.reason.stime / 3600 >> 0) + ":" + (msg.reason.stime / 60 % 60 >> 0) + ":" + (msg.reason.stime % 60 >> 0);
                document.getElementById("UserPackage").innerHTML = msg.reason.package;
                document.getElementById("UserMaxBots").innerHTML = msg.reason.maxbots;
            } break;
        }
    }
}
connect();