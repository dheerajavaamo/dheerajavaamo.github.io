var polly_url = "https://c3.avaamo.com/web_channels/ssml_to_voice.json";
var dashboard_access_token = "3832ed8031db4cc485dba1448257dd60";
const proxyurl = "https://cors-crush.herokuapp.com/";

let bot_id = 3722;
let channel_uuid= "73c36068-d8c6-4c01-b2da-1fdfe3ccf85e";
let custom_channel_url = "https://c7.avaamo.com/bot_connector_webhooks/006b759f-583d-477e-ae54-5544d78e6f29/message.json";


const urlParams = new URLSearchParams(window.location.search);
const voiceLang = urlParams.get('voice') || "en-US";
let voice_locale = urlParams.get('voice') || "en-US";

let persona = urlParams.get('persona') || "Joanna";