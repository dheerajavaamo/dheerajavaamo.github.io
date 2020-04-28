var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
    SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var grammar_words = [
    "insurance",
    "auto insurance",
    "email",
    "account",
    "account number",
    "drivers",
    "drivers license",
    "city",
    "state",
    "country",
    "civic",
    "honda",
    "hyundai",
    "phone",
    "hurt",
    "stark",
    "accident",
    "got",
    "luckily"
];
var grammar =
    "#JSGF V1.0; grammar colors; public <color> = " + grammar_words.join(" | ") + " ;";
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = true;
recognition.maxAlternatives = 1;


var diagnostic = document.querySelector(".speech_output");
var microphone = document.querySelector(".fa-microphone");

// document.body.onclick = function () {
//     recognition.start();
//     console.log("Ready to receive a color command.");
// };

recognition.onend = function(){
    microphone.classList.remove("active");
};

recognition.onresult = function (event) {
    var speechResult = event.results[0];
    var transcript = speechResult[0].transcript;
    diagnostic.textContent = transcript;
    if (speechResult.isFinal) {
        diagnostic.style.color = "black";
        sendMessage(transcript);
    } else {
        diagnostic.style.color = "lightgray";
    }
};

function toggleSpeech(){
    microphone.classList.add("active");
    recognition.start();
}