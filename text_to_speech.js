var polly_url = "https://c6.avaamo.com/web_channels/ssml_to_voice.json";
var dashboard_access_token = "23c0601fb7704e30836cea931e266b26";

function getPollyUtterance(text) {
    return fetch(polly_url, {
        "headers": {
            "content-type": "application/json",
            "Access-Token": dashboard_access_token
        },
        "body": JSON.stringify({
            ssml: "<speak>" + text + "</speak>",
            locale: "en-US",
            persona: "Joanna"
        }),
        "method": "POST"
    }).then(res => res.json()).then(json => json.location);
}

var audioElement = document.querySelector("#reader");

var synth = window.speechSynthesis;

var readQueue = [];
var isReading = false;

const urlParams = new URLSearchParams(window.location.search);
const voiceLang = urlParams.get('voice') || "en-US";
var selectedVoice;
getSelectedVoice();

function getSelectedVoice() {
    let filteredvoices = synth.getVoices().filter(v => v.lang == voiceLang);
    selectedVoice = filteredvoices.find(v => v.name === "Samantha") || filteredvoices[0];
}

function speak(text, onSpeechComplete) {
    readQueue.push(text);

    if (readQueue.length == 1 && !isReading) {
        isReading = true;
        speakNow(readQueue.shift(), onComplete, onSpeechComplete);
    }

}

function onComplete(onSpeechComplete) {
    let nextText = readQueue.shift();
    if (nextText) {
        speakNow(nextText, onComplete, onSpeechComplete);
    } else {
        isReading = false;
        console.log("Calling on Speechcomplete");
        onSpeechComplete();
    }
}

function speakNow(text, onComplete, onSpeechComplete) {
    getPollyUtterance(text).then(location => {
        audioElement.src = location;
        audioElement.play();
        audioElement.onended = () => {
            onComplete(onSpeechComplete);
        };
    });
}