let lastMessageUUID;
let agentResponse = document.querySelector(".agent-prompt");
let avaamo_id;
let storage_url;

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

function sendMessage(message) {
    // Avaamo.sendMessage(message);
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
        json.incoming_message.bot_replies.forEach(handleAgentResponse);
    });
}


function handleAgentResponse(m){
    if(m.text && m.text.indexOf("avaamo_id") > -1){
        avaamo_id = JSON.parse(m.text).avaamo_id;
        storage_url = `https://c7.avaamo.com/dashboard/bots/${bot_id}/storages.json?user_id=${avaamo_id}`;
        getStorage(storage_url);
        return;
    }
    if (m.request_message_uuid != lastMessageUUID) {
        lastMessageUUID = m.request_message_uuid;
        if(avaamo_id)getStorage(storage_url);
        agentResponse.innerHTML = "";
    }
    if(m.text){
        let newMessage = document.createElement("p");
        newMessage.innerText = m.text;
        agentResponse.appendChild(newMessage);
        if (m.text.indexOf("license?") > -1) {
          addAlphaNumericHint();
        } else if(m.text.indexOf("phone number?") > -1 || m.text.indexOf("account number?") > -1){
          addNumberHint();
        }
        else if(m.text.indexOf("zip code?") > -1){
          addZipcodeHint();
        } else {
          addGeneralHints();
        }
        if(!window.disable_speech){
          speak(m.text, () => {
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