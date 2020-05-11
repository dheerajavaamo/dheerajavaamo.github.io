var isTraining = false;

function expandTextPopup(className) {
    var text = $("." + className).html()
    $('#textModal').find(".modal-body").html(text)
    $('#textModal').modal('show');
}

function openSettingPage() {
    $('.mainPage').hide();
    $('.voiceTrainingPage').hide();
    $('.settingPage').show();
    $('footer .speech_output').empty();
    $('footer').css('visibility', 'hidden');
    isTraining = false;
}

function openMainPage() {
    $('.settingPage').hide();
    $('.voiceTrainingPage').hide();
    $('.mainPage').show();
    $('footer .speech_output').empty();
    $('footer').css('visibility', 'visible');
}

function openVoiceTraining() {
    $('.settingPage').hide();
    $('.mainPage').hide();
    $('.voiceTrainingPage').show();
    $('footer .speech_output').empty();
    $('footer').css('visibility', 'visible');
    isTraining = true;
}

function changeLang() {
    var lang = urlParams.get('lang') || localStorage.getItem("lang", "en") || "en";
    if (lang == 'en') {
        lang = 'jp';
        localStorage.setItem("lang", lang);
        $(".langSwitch span").html('英語');
        $("#Matthew, #Joanna").parent().hide();
        $("#Takumi, #Mizuki").parent().show();
        $("#en-IN, #en-US").parent().hide();
        $("#ja-JP").parent().show();

        if(user_locale != "ja-JP"){
            user_locale = "ja-JP";
            agent_locale = "ja-JP";
            persona = "Mizuki";
            localStorage.setItem("agent_locale", agent_locale);
            localStorage.setItem("persona", persona);
        }
        
    } else {
        lang = 'en';
        localStorage.setItem("lang", lang);
        $(".langSwitch span").html('Japanese');
        $("#Takumi, #Mizuki").parent().hide();
        $("#Matthew, #Joanna").parent().show();
        $("#en-IN, #en-US").parent().show();
        $("#ja-JP").parent().hide();

        if(user_locale != "en-US"){
            user_locale = "en-US";
            agent_locale = "en-US";
            persona = "Joanna";
            localStorage.setItem("agent_locale", agent_locale);
            localStorage.setItem("persona", persona);
        }
        
    }
    languageChanged(user_locale);

    $("[data-localize]").localize("local", {
        language: lang,
        pathPrefix: "./locals"
    });
}

function changeVoice(lang) {
    if(lang == 'en') {
        $("#Takumi, #Mizuki").parent().hide();
        $("#Matthew, #Joanna").parent().show();
        $("#Joanna").prop('checked', true);
    } else {
        $("#Matthew, #Joanna").parent().hide();
        $("#Takumi, #Mizuki").parent().show();
        $("#Takumi").prop('checked', true);
    }
}

