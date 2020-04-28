var synth = window.speechSynthesis;

var readQueue = [];
var isReading = false;

const urlParams = new URLSearchParams(window.location.search);
const voiceLang = urlParams.get('voice') || "en-US";
var selectedVoice;
getSelectedVoice();

function getSelectedVoice(){
    let filteredvoices = synth.getVoices().filter(v => v.lang == voiceLang);
    selectedVoice = filteredvoices.find(v => v.name === "Samantha") || filteredvoices[0];
}

function speak(text, onSpeechComplete) {
    readQueue.push(text);

    if(readQueue.length == 1 && !isReading){
        isReading = true;
        speakNow(readQueue.shift(), onComplete, onSpeechComplete);
    }
    
}

function onComplete(onSpeechComplete){
    let nextText = readQueue.shift();
    if(nextText){
        speakNow(nextText, onComplete, onSpeechComplete);
    }
    else{
        isReading = false;
        console.log("Calling on Speechcomplete");
        onSpeechComplete();
    }
}

function speakNow(text, onComplete, onSpeechComplete){
    var utterThis = new SpeechSynthesisUtterance(text);
    if(!selectedVoice){
        getSelectedVoice();
    }

    utterThis.voice = selectedVoice;

    synth.speak(utterThis);

    utterThis.onend = function (event) {
        onComplete(onSpeechComplete);
        console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
    };
}