let lastMessageUUID;
let agentResponse = document.querySelector(".agent-prompt");
let avaamo_id;
let storage_url;
let bot_id = 3722;

function sendMessage(message) {
    Avaamo.sendMessage(message);
}

window.addEventListener("message", function (e) {
    if (e.data && e.data.source == "custom") {
        if (e.data.fn == "openLink") {
            var ele = document.getElementById("CustomWebView");
            ele.src = e.data.url;
        }
    }
});

function initMessageHandler() {
    Avaamo.onBotMessage = function (m) {
        if(m.content && m.content.indexOf("avaamo_id") > -1){
            avaamo_id = JSON.parse(m.content).avaamo_id;
            storage_url = `https://c7.avaamo.com/dashboard/bots/${bot_id}/storages.json?user_id=${avaamo_id}`;
            getStorage(storage_url);
            return;
        }
        if (m.request_message_uuid != lastMessageUUID) {
            lastMessageUUID = m.request_message_uuid;
            if(avaamo_id)getStorage(storage_url);
            agentResponse.innerHTML = "";
        }
        let newMessage = document.createElement("p");
        newMessage.innerText = m.content;
        agentResponse.appendChild(newMessage);
    };
}