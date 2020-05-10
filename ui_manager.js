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
        lang = 'jp'
        localStorage.setItem("lang", lang)
        $(".langSwitch span").html('英語');
    } else {
        lang = 'en'
        localStorage.setItem("lang", lang)
        $(".langSwitch span").html('Japanese');
    }

    $("[data-localize]").localize("local", {
        language: lang,
        pathPrefix: "./locals"
    })

}

