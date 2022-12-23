function sendURL() {
    findServers(9876, "192.168.8.", 50, 60, 10, 1000, function(servers) {
        if (servers.length > 0) {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(tabs => {
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {"url": servers[0]});
                }
            });
        }
    });
}

function findServers(port, ipBase, ipLow, ipHigh, maxInFlight, timeout, cb) {
    var ipCurrent = +ipLow, numInFlight = 0, servers = [];
    ipHigh = +ipHigh;

    function tryOne(ip) {
        ++numInFlight;
        var address = "ws://" + ipBase + ip + ":" + port;
        var socket = new WebSocket(address);
        var timer = setTimeout(function() {
            var s = socket;
            socket = null;
            s.close();
            --numInFlight;
            next();
        }, timeout);
        socket.onopen = function() {
            if (socket) {
                clearTimeout(timer);
                servers.push(socket.url);
                --numInFlight;
                next();
            }
        };
        socket.onerror = function(err) {
            if (socket) {
                clearTimeout(timer);
                --numInFlight;
                next();
            }
        }
    }

    function next() {
        while (ipCurrent <= ipHigh && numInFlight < maxInFlight) {
            tryOne(ipCurrent++);
        }

        if (numInFlight === 0) {
            cb(servers)
        }
    }

    next();
}

browser.browserAction.onClicked.addListener(sendURL);
