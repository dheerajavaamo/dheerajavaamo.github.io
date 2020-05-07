var polly_url = "https://c7.avaamo.com/web_channels/ssml_to_voice.json";
var dashboard_access_token = "93ad5572f6cc489f8242249cbcbc2afb";
const proxyurl = "https://cors-crush.herokuapp.com/";

let bot_id = 3722;
let channel_uuid= "73c36068-d8c6-4c01-b2da-1fdfe3ccf85e";
let custom_channel_url = "https://c7.avaamo.com/bot_connector_webhooks/006b759f-583d-477e-ae54-5544d78e6f29/message.json";


const urlParams = new URLSearchParams(window.location.search);
let user_locale = urlParams.get('user_locale') || localStorage.getItem("user_locale", "en-US");
let agent_locale = urlParams.get('agent_locale') || localStorage.getItem("agent_locale", "en-US");

let persona = urlParams.get('persona') || localStorage.getItem("persona", "Joanna");

const idle_timeout = 5000;

function createVariablesFromParams(){
    for(var key of urlParams.keys()) { 
        window[key] = urlParams.get(key);
    }
}

createVariablesFromParams();

function onPersonaSelected(selectedPersona){
    persona = selectedPersona;
    switch(selectedPersona){
        case "Joanna":
        case "Joey":
        case "Matthew":
            agent_locale = "en-US";
            break;
        case "Takumi":
            agent_locale = "ja-JP";
    }
    localStorage.setItem("agent_locale", agent_locale);
    localStorage.setItem("persona", persona);
}

function onUserLocaleSelected(selectedLocale){
    user_locale = selectedLocale;
    localStorage.setItem("user_locale", user_locale);
}

function setCheckedStatus(){
    let personaElement = document.querySelector("#"+persona);
    if(personaElement){
        personaElement.checked = true;
    }

    let localeElement = document.querySelector("#"+user_locale);
    if(localeElement){
        localeElement.checked = true;
    }
}