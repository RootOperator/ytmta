function sendData(webSocketURL, pageURL) {
    const ws = new WebSocket(webSocketURL);
    
    ws.onopen = function(e) {
        ws.send(pageURL)
    }
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function formatTime(rawTime) {
    let seconds = 0;
    let t = rawTime.split("/")[0];
    let s = t.split(":");

    if (s.length == 3) {
        seconds = (+s[0]) * 60 * 60 + (+s[1]) * 60 + (+s[2]);
    }

    if (s.length == 2) {
        seconds = (+s[0]) * 60 + (+s[1]);
    }

    return seconds
}


browser.runtime.onMessage.addListener(request => {
    let url = window.location.href;
    let rawTime = getElementByXpath("/html/body/ytmusic-app/ytmusic-app-layout/ytmusic-player-bar/div[1]/span").innerText
    let seconds = formatTime(rawTime)
    let formatURL = url + "&t=" + seconds

    // bypass YoutubeNonStop extension
    let video = document.querySelector("video");
    video.yns_pause = video.pause;
    video.yns_pause()

    sendData(request.url, formatURL)
})
