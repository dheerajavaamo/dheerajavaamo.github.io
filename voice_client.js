'use strict'

//connection to socket
const socket = io.connect("https://voice.aiavaamo.com");


let emailReplacements = {
    "@gmail.com": /\s*(c?at|@|got|and)\s*gmail(\s*\.\s*(com|org|in))?/gi,
    "@123.com": /\s*(c?at|got|and) (want|one|1) (2|tw?o) (three|3)\.\s*(com|org|in)/gi,
    "@$1.$2": /\s*(?:c?at|@|got|and)\s*(\w{3,})\s*\.\s*(com|org|in)/gi
};

let replacements = [emailReplacements];

let processedUtterance = "";

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
            timeSlice: 200,
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

function addAlphaNumericHint(){
    console.log("adding alpha numeric hint");
    addHints(alpha_numeric_hints);
}
function addGeneralHints(){
    console.log("adding general hints");
    addHints(general_hints);
}
function addNumberHint(){
    console.log("adding phone number hint");
    addHints(number_hints);
}

function addZipcodeHint(){
    console.log("adding zipcode hint");
    addHints(zip_code_hint);
}

function addHints(hints) {
    socket.emit('hints', hints);
}

function toggleSpeech(){
    if(isRecording){
        stopRecording();
    }
    else{
        stopSpeech();
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

    if(processedUtterance && !isTraining) sendMessage(processedUtterance);
    processedUtterance = "";
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
    languageChanged(user_locale);
    addHints(general_hints);
});

socket.on('speechData', function (data) {
    if(!isRecording){
        return;
    }
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
    processedUtterance = dictation + " " + intermediateText;
    
    diagnostic.innerHTML = "<span class='final'>" + processedUtterance + "</span>" + " <span class='intermediate'>" + "" + "</span>";
});

function postProcessUtterance(text){
    replacements.forEach(r => {
        Object.keys(r).forEach(key => {
            text = text.replace(r[key], key);
        });
    });

    return text;

}


window.onbeforeunload = function () {
    if (streamStreaming) {
        socket.emit('endGoogleCloudStream', '');
    }
};