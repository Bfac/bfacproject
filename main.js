var ws = {};
window.loadTime = null;
function pdata(data) {
    return new DataView(new ArrayBuffer(data));
}
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
function connect() {
    ws = new WebSocket("ws://194.87.95.4:5000");
	ws.binaryType = "arraybuffer";
    ws.onopen = function (arg) {
        ws.send(JSON.stringify({
            data: "getUserStatus",
            userip: httpGet("https://api.ipify.org/")
        }));
	}
	ws.onclose = function(arg) {
		connect();
	}
	ws.onmessage = function(message) {
		var msg = JSON.parse(message.data);
        console.log(msg.data);
        document.getElementById("userip").innerHTML = msg.reason.ip;
        document.getElementById("usertime").innerHTML = (msg.reason.time / 3600 >> 0) + ":" + (msg.reason.time / 60 % 60 >> 0) + ":" + (msg.reason.time % 60 >> 0);
        document.getElementById("userpackage").innerHTML = msg.reason.package;
        document.getElementById("usermaxbots").innerHTML = msg.reason.maxbots;
	}
}
connect();