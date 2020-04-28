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
    "luckily",
    "sriram",
    "chakravarthy"
];
var grammar =
    "#JSGF V1.0; grammar colors; public <color> = " + grammar_words.join(" | ") + " ;";
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = user_locale;
recognition.interimResults = true;
recognition.maxAlternatives = 1;

var intermittantText = "";
var dictation = "";
var isListening = false;


var diagnostic = document.querySelector(".speech_output");
var microphone = document.querySelector(".fa-microphone");

function resetSpeechData(){
    intermittantText = "";
    dictation = "";
}

recognition.onstart = function(){
    microphone.classList.add("active");
    isListening = true;
};


recognition.onend = function(){
    microphone.classList.remove("active");
    if(dictation)sendMessage(dictation);
    isListening = false;
    resetSpeechData();
};

recognition.onresult = function (event) {
    resetSpeechData();
    console.log(event.results);
    for(var idx = 0; idx < event.results.length ; idx++){
        var r = event.results[idx];
        var transcript = r[0].transcript;
        if(r.isFinal){
            dictation += " " + transcript;
        }
        else{
            intermittantText += " " + transcript;
        }
    }
    
    diagnostic.innerHTML = "<span class='final'>" + dictation + "</span>" + " <span class='intermediate'>" + intermittantText + "</span>";
};

function toggleSpeech(){
    if(isListening){
        recognition.stop();
    }
    else{
        recognition.start();
    }
}