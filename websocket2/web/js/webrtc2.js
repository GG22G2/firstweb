var tomcatadress="ws://125.73.52.194:54321/socket"
var stunserver = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }, { "url": "stun:112.74.191.189:3478" }] }; //stun服务器地址
var channel = null; //用于传递数据
var localvideostream = null;
var remotevideostream = null;
var ws; // websocket对象
var id; //唯一标识
var room = "4";
var target; //连接的目标的唯一标识
var state; //应该当offer还是answer
var PRTConnection;
var connectvideo = true; //是否开启摄像头
var front=true;

var constraints1 = {
    audio: false,
    video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 776, ideal: 720, max: 1080 },
        facingMode: (front? "environment" : "user")
    }
} //定义音频和视频   environment代表后置摄像头  user代表前置摄像头

var constraints2 = {
    audio: false,
    video: {
        width: { ideal: 1920},
        height: { ideal: 1080},
        facingMode: (front? "environment" : "user"),
        frameRate: { ideal: 100, max: 150 }
    }
} //定义音频和视频

//从start函数开始

async function start() {
  await  mediainit();
    ws = creatwebsocket();
}


function ConnectToTarget() {

    PRTConnection = new RTCPeerConnection(stunserver);
    PRTConnection.onaddstream = function(event) {
        console.log("接收到视频流")
        remotevideostream = event.stream;
        var video = document.querySelector('#remotevideo');
        video.srcObject = event.stream;

        video.onloadedmetadata = function(e) {
            video.play();
        };
    };

    PRTConnection.oniceconnectionstatechange = wheniceconnectionstatechage;
     PRTConnection.onicegatheringstatechange = whenicegatheringstatechange;

    if (localvideostream != null) {
        PRTConnection.addStream(localvideostream);
    }
    PRTConnection.onicecandidate = sendcandidate;
}

function connect(Promise) {
    Promise.then(function(e) { PRTConnection.setLocalDescription(e) })
        .then(function() {
            var content = JSON.stringify({
                "what": "2",
                "sdp": PRTConnection.localDescription,
                "room": room,
                "id": id,
                "target": target
            });
            ws.send(content);
        }).
    catch(function(e) {
        console.log(e);
    })
}

function sendcandidate(e) {
    if (e.candidate) {
        var content = JSON.stringify({
            "what": "3",
            "candidate": e.candidate,
            "room": room,
            "id": id,
            "target": target
        });
        ws.send(content);
    }
}

function wheniceconnectionstatechage(e) {
    let state = PRTConnection.iceConnectionState;
    console.log("RRTiceconnection status has changed to " + state);
    if (state == "completed") {
       // ws.send(JSON.stringify({ "what": "4", "room": room, "id": id }));
        printf(PRTConnection)
     
    }else{
    
    }
}

function whenicegatheringstatechange(e) {
    let state = PRTConnection.iceGatheringState;
    	console.log("RRTicegathering status has changed to " + state)
    if (state == "completed") {
       
    }
}



async function mediainit() {
    if (connectvideo) {

        let mediaStream = await navigator.mediaDevices.getUserMedia(constraints2)
        printf(mediaStream)
        localvideostream = mediaStream;
        let video = document.querySelector('#localvideo');
        video.srcObject = mediaStream;

        video.onloadedmetadata = function(e) {
            video.play()
        }
    }

}

function creatwebsocket() {
    let ws = new WebSocket(tomcatadress);
    ws.onopen = function() {

    };

    // 接收服务端数据时触发事件
    ws.onmessage = function(evt) {
        var msg = JSON.parse(evt.data);
        printf(msg)
        exchangemsg(msg);

    };
    // 断开 web socket 连接成功触发事件
    ws.onclose = function(e) {
        console.log("连接已关闭");
        console.log(e);
        ws.send("关闭了");
    };
    return ws;
}


function exchangemsg(msg) {
    switch (parseInt(msg.what)) {
        case 0:
            id = msg.id;
            printf(id);
            ws.send(JSON.stringify({ "what": "0", "room": room, "id": id }));
            break;
        case 1:

            state = msg.state;
            target = msg.target;
            ConnectToTarget();
            if (state == "offer") {
                Promise = new Promise((resolve) => {
                    resolve(PRTConnection.createOffer())
                })
                connect(Promise);
            }
            break;
        case 2:
            PRTConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            if (state == "answer") {
                Promise = new Promise((resolve) => {
                    resolve(PRTConnection.createAnswer())
                })
                connect(Promise);
            }
            break;
        case 3:
            PRTConnection.addIceCandidate(new RTCIceCandidate(msg.candidate))
            break;

    }
}


function printf(message) {
    console.log(message);
}