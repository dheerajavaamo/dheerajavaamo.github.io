function translateToUsingGoogle(text, target_lang){
    return fetch(google_translation_url, { method: 'post', body: JSON.stringify({ q: text, target: target_lang.split("-")[0]})}).
        then(r=> r.json()).
        then(json=>{
            let translations = json.data.translations;
            return translations[0].translatedText;
    }).catch(e=>{
        console.error("EXCEPTION IN TRANSLATION ====>>>", e);
        return Promise.resolve(text);
    });
}


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
    if(window.translation_agent == "google"){
        return translateToUsingGoogle(text, target_lang);
    }
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