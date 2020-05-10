
function translateToJapanese(text){
    if(text == "reset"){
        return Promise.resolve(text);
    }
    return translateTo(text, "JA");
}

function translateToEnglish(text){
    return translateTo(text, "EN");
}

function translateTo(text, target_lang){
    return fetch(translation_url + formatParams({
        auth_key: window.auth_key,
        text: text,
        target_lang: target_lang
    }), {
        method: "GET",
        "Content-Type": "application/x-www-form-urlencoded"
    }).then(res => res.json())
    .then(json => (json.translations || [{}])[0].text)
    .catch(console.error);
}

function formatParams( params ){
    return "?" + Object
          .keys(params)
          .map(function(key){
            return key+"="+encodeURIComponent(params[key]);
          })
          .join("&");
  }