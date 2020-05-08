let polly_mapping = {};

function getPollyUtterance(text) {
    return fetch(polly_url, {
        "headers": {
            "content-type": "application/json",
            "Access-Token": dashboard_access_token
        },
        "body": JSON.stringify({
            ssml: "<speak>" + text + "</speak>",
            locale: agent_locale,
            persona: persona
        }),
        "method": "POST"
    }).then(res => res.json()).then(json => {
        polly_mapping[text] = json.location;
        return json.location;
    });
}

var audioElement = document.querySelector("#reader");

var readQueue = [];
var isReading = false;

function speak(text, onSpeechComplete) {
    readQueue.push(text);

    if (readQueue.length == 1 && !isReading) {
        isReading = true;
        speakNow(readQueue.shift(), onComplete, onSpeechComplete);
    }
    else{
        getPollyUtterance(text);
    }

}

function onComplete(onSpeechComplete) {
    let nextText = readQueue.shift();
    if (!isRecording && nextText) {
        speakNow(nextText, onComplete, onSpeechComplete);
    } else {
        isReading = false;
        console.log("Calling on Speechcomplete");
        onSpeechComplete();
    }
}

function speakNow(text, onComplete, onSpeechComplete) {
    if(polly_mapping[text]){
        readThis(polly_mapping[text], onComplete, onSpeechComplete);
    }
    else{
        getPollyUtterance(text).then(location => {
            readThis(location, onComplete, onSpeechComplete);
        });
    }
}

function readThis(location, onComplete, onSpeechComplete){
    audioElement.src = location;
    playAudio();
    audioElement.onended = () => {
        onComplete(onSpeechComplete);
    };
}

function playAudio(){
    audioElement.play();
}

function stopSpeech(){
    if(isReading){
        audioElement.pause();
        audioElement.src = "";
        isReading = false;
        readQueue.length = 0;
    }
}