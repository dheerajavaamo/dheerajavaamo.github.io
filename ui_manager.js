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
    $('footer').css('visibility', 'hidden');
    isTraining = false;
}

function openMainPage() {
    $('.settingPage').hide();
    $('.voiceTrainingPage').hide();
    $('.mainPage').show();
    $('footer').css('visibility', 'visible');
}

function openVoiceTraining() {
    $('.settingPage').hide();
    $('.mainPage').hide();
    $('.voiceTrainingPage').show();
    $('footer').css('visibility', 'visible');
    isTraining = true;
}