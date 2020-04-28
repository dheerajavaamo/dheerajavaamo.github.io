'use strict'

//connection to socket
const socket = io.connect("https://voice.aiavaamo.com");
// const socket = io.connect("http://ec2-52-53-186-226.us-west-1.compute.amazonaws.com:1337");

//================= CONFIG =================
// Stream Audio
var bufferSize = 2048,
    context,
    processor,
    input,
    recorder,
    globalStream;

//vars
var isRecording = false,
    finalWord = false,
    paused = false,
    initialized = false,
    streamStreaming = false;

//audioStream constraints
const constraints = {
    audio: true,
    video: false
};

var diagnostic = document.querySelector(".speech_output");
var microphone = document.querySelector(".fa-microphone");

var intermediateText = "";
var dictation = "";

function resetSpeechData(onlyIntermediate){
    if(!onlyIntermediate){
        dictation = "";
    }
    intermediateText = "";
    
}

let idleTimer;


//================= RECORDING =================


function initRecording() {
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        initialized = true;

        recorder = RecordRTC(stream, {
            timeSlice: 1000,
            bufferSize: 4096,
            desiredSampRate: 16000,
            type: 'audio',
            mimeType: 'audio/wav',
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1,
            onAudioProcessStarted: function () {
                console.log('started');
            },
            ondataavailable: function (blob) {
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    socket.emit('binaryData', this.result);
                };
                fileReader.readAsArrayBuffer(blob);
            }
        });

    }).catch(function (error) {
        console.error(error);
    });
}


function languageChanged(lang) {
    console.log("sending language changed", lang);
    socket.emit('languageChanged', lang);
}

function addHints(hints) {
    socket.emit('hints', hints);
}

function toggleSpeech(){
    if(isRecording){
        stopRecording();
    }
    else{
        startRecording();
    }
}


function startRecording() {
    if (!initialized) {
        initialized = true;
        initRecording();
    } else {
        startIdleTimer();
        microphone.classList.add("active");
        isRecording = true;
        if (paused) {
            recorder.resumeRecording();
        } else {
            recorder.startRecording();
        }
        socket.emit('startGoogleCloudStream', '');
    }
}

function stopRecording() {
    isRecording = false;
    paused = true;
    recorder.pauseRecording();

    socket.emit('endGoogleCloudStream', '');

    microphone.classList.remove("active");
    if(dictation)sendMessage(dictation);
    resetSpeechData();
}

function startIdleTimer(){
    cancelIdleTimer();
    console.log("scheduling timer");
    idleTimer = setTimeout(stopRecording, idle_timeout);
}
function cancelIdleTimer(){
    console.log("cancelling timer");
    if(idleTimer){
        clearTimeout(idleTimer);
    }
}

//================= SOCKET IO =================
socket.on('connect', function (data) {
    socket.emit('join', 'Server Connected to Client');
    
});

socket.on('messages', function (data) {
    console.log("Socket connected");
    if(user_locale != "en-IN"){
        languageChanged(user_locale);
    }
});

socket.on('speechData', function (data) {
    startIdleTimer();
    console.log("voice data", data);

    resetSpeechData(true);

    for(var idx = 0; idx < data.results.length ; idx++){
        var r = data.results[idx];
        var transcript = r.alternatives[0].transcript;
        if(r.isFinal){
            dictation += " " + transcript;
        }
        else{
            intermediateText += " " + transcript;
        }
    }
    diagnostic.innerHTML = "<span class='final'>" + dictation + "</span>" + " <span class='intermediate'>" + intermediateText + "</span>";
});


window.onbeforeunload = function () {
    if (streamStreaming) {
        socket.emit('endGoogleCloudStream', '');
    }
};