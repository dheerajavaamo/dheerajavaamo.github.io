let lastMessageUUID;
let agentResponse = document.querySelector(".agent-prompt");
let avaamo_id;
let parsed_storage_url;

let existing_user_uuid = null; //localStorage.getItem("user_uuid");
let isExistingUser = existing_user_uuid;
let user_uuid = existing_user_uuid || function uuid4() {
    var uuid = '',
    ii;
    for (ii = 0; ii < 32; ii += 1) {
      switch (ii) {
        case 8:
        case 20:
        uuid += '-';
        uuid += (Math.random() * 16 | 0).toString(16);
        break;
        case 12:
        uuid += '-';
        uuid += '4';
        break;
        case 16:
        uuid += '-';
        uuid += (Math.random() * 4 | 8).toString(16);
        break;
        default:
        uuid += (Math.random() * 16 | 0).toString(16);
      }
    }
    return uuid;
  }();

  localStorage.setItem("user_uuid", user_uuid);

function extractTimeEntity(text){
  let extractedDates = chrono.parse(text.replace(/days back/gi, "days ago")
  .replace(/(0|O) clock in the afternoon/gi, "pm")
  .replace(/(0|O) clock in the night/gi, "pm")
  .replace(/(0|O) clock in the morning/gi, "am")
  .replace(/(\d) in the morning/gi, "$1 am")
  .replace(/(\d) in the afternoon/gi, "$1 pm")
  );

    let extracted_time = "";

    extractedDates.forEach(d => {
        if(extracted_time || d.text.length <= 3 || d.text.match(/\d{3}-\d{3}/gi) || d.text.toLowerCase() === "now"){
            return;
        }
        if(d.start && d.start.knownValues && d.start.knownValues.hour){
            let am_pm = "am"
            if(d.start.knownValues.hour > 12){
                d.start.knownValues.hour -= 12;
                am_pm = "pm"
            }
            if(d.start.knownValues.minute < 10){
                d.start.knownValues.minute = "0" + d.start.knownValues.minute;
            }
            extracted_time = `${d.start.knownValues.hour}:${d.start.knownValues.minute} ${am_pm}`;
        }
    });
    if(extracted_time){
        text = text + "time_of_incident:" + extracted_time;
    }
    return text;
}
function sendMessage(message) {
    // Avaamo.sendMessage(message);
    translateIfRequired(message, "en-US", user_locale).then(message => {
      message = extractTimeEntity(message);
      fetch(proxyurl + custom_channel_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "channel_uuid": channel_uuid,
            "user": {
              "uuid": user_uuid
            },
            "message": {
              "text": message
            }
          })
      }).then(res => res.json()).then(json => {
          console.log(json);
          handleAgentResponses(json.incoming_message.bot_replies);
      });
    });
    
}

async function translateIfRequired(message, target_language, source_language){
  if(!message){
    return null;
  }
  message = message.replace(/days back/gi, "days ago");
  console.log("message, target_language, source_language", message, target_language, source_language);
  if(source_language != target_language){
    let translatedText = "ja-JP" == target_language ? await translateToJapanese(message) : await translateToEnglish(message);
    if(translatedText){
      message = translatedText;
      console.log("Translated text", message);
    }
    else{
      console.log("Translation failed");
    }
  }
  return message;
}

async function handleAgentResponses(replies){
  for(let idx =  0; idx < replies.length; idx++){
    await handleAgentResponse(replies[idx]);
  }
}

async function handleAgentResponse(m){
    if(m.text && m.text.indexOf("avaamo_id") > -1){
        avaamo_id = JSON.parse(m.text).avaamo_id;
        parsed_storage_url = `${storage_url}/${bot_id}/storages.json?user_id=${avaamo_id}`;
        getStorage(parsed_storage_url);
        return;
    }
    if (m.request_message_uuid != lastMessageUUID) {
        lastMessageUUID = m.request_message_uuid;
        if(avaamo_id)getStorage(parsed_storage_url);
        agentResponse.innerHTML = "";
    }
    if(m.text){
      let message = await translateIfRequired(m.text, user_locale, "en-US");
      console.log("Got translated message", message);
      let newMessage = document.createElement("p");
      newMessage.innerText = message;
      agentResponse.appendChild(newMessage);
      if (message.indexOf("license?") > -1) {
        addAlphaNumericHint();
      } else if(message.indexOf("phone number?") > -1 || message.indexOf("account number?") > -1){
        addNumberHint();
      }
      else if(message.indexOf("zip code?") > -1){
        addZipcodeHint();
      } else {
        addGeneralHints();
      }
      // window.disable_speech  = true;
      if(!window.disable_speech){
        console.log("Speaking message", message);
        speak(message, () => {
          // toggleSpeech();
        });
      }
    }

}

function initMessageHandler() {
    if(isExistingUser){
      sendMessage("existing_user");
    }
    else{
      sendMessage("reset");
    }
}