var polly_url = "https://c7.avaamo.com/web_channels/ssml_to_voice.json";
var dashboard_access_token = "93ad5572f6cc489f8242249cbcbc2afb";
const proxyurl = "https://cors-crush.herokuapp.com/";

let bot_id = 3722;
let storage_url = "https://c7.avaamo.com/dashboard/bots";
let storage_access_token = "23c0601fb7704e30836cea931e266b26";
let channel_uuid= "73c36068-d8c6-4c01-b2da-1fdfe3ccf85e";
let custom_channel_url = "https://c7.avaamo.com/bot_connector_webhooks/006b759f-583d-477e-ae54-5544d78e6f29/message.json";

// C6
bot_id = 20017;
storage_url = "https://c6.avaamo.com/dashboard/bots";
storage_access_token = "a7bd590873c94c7e9c6777e1bb782ed1";
custom_channel_url = "https://c6.avaamo.com//bot_connector_webhooks/375bc2e9-88b1-4cac-af71-986c1d31be6a/message.json";
channel_uuid = "2d522fe0-e8a1-4775-a4f3-71b2e73f782b";

window.auth_key = "b6433450-2192-3b76-fe60-4917a54be58b";

let general_hints = [
    "Sriram",
    "Chakravarthi",
    "Madhav",
    "Vodnala",
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
    "got",
    "luckily",
    "driver",
    "license",
    "van",
    "injured",
    "insurance",
    "hit from behind",
    "drive",
    "car",
    "report",
    "accident",
    "bumper",
    "dent",
    "forester",
    "mercedes",
    "whole foods",
    "Sunnyvale",
    "parking lot",
    "mustang",
    "towing",
    "Santa clara",
    "Saratoga",
    "Kiely",
    "rear ended",
    "incident",
    "Expressway",
    "Lawrence",
    "vehicle"

];
let alpha_numeric_hints = ["$OOV_CLASS_ALPHANUMERIC_SEQUENCE"].concat(general_hints);
let number_hints = ["$OOV_CLASS_DIGIT_SEQUENCE"].concat(general_hints);
let zip_code_hint = ["$POSTALCODE"].concat(general_hints);

const urlParams = new URLSearchParams(window.location.search);
let user_locale = urlParams.get('user_locale') || localStorage.getItem("user_locale", "en-US") || "en-US";
let agent_locale = urlParams.get('agent_locale') || localStorage.getItem("agent_locale", "en-US") || "en-US";

let persona = urlParams.get('persona') || localStorage.getItem("persona", "Joanna") || "Joanna";
var lang = urlParams.get('lang') || localStorage.getItem("lang", "en") || "en";
if(lang == "en"){
    if(user_locale != "en-US"){
        user_locale = "en-US";
        agent_locale = "en-US";
        persona = "Joanna";
    }
}
else if(user_locale != "ja-JP"){
    user_locale = "ja-JP";
    agent_locale = "ja-JP";
    persona = "Mizuki";
}

const idle_timeout = 5000;

function createVariablesFromParams(){
    for(var key of urlParams.keys()) {
        window[key] = urlParams.get(key);
    }
}

createVariablesFromParams();

let translation_url = `https://api.deepl.com/v2/translate`;

function onPersonaSelected(selectedPersona){
    persona = selectedPersona;
    switch(selectedPersona){
        case "Joanna":
        case "Joey":
        case "Matthew":
            agent_locale = "en-US";
            break;
        case "Takumi":
        case "Mizuki":
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