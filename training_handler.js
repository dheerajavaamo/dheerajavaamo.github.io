let training_index = 0;

function initTraining(){
    resetTrainingStatus();
    
    updateTrainingStatus();

    startTraining();
}

function startTraining(){
    toggleSpeech();
}

function trainingSpeechComplete(utterance){
    let currentTrainingPhrase = document.querySelectorAll(".voiceTrainingPage .form-check")[training_index].innerText;
    let splitRegex = /[\s,.-]+/gi;
    if(utterance.split(splitRegex).map(w => w.toLowerCase())
    .find(utteredWord => currentTrainingPhrase.split(splitRegex).map(w => w.toLowerCase()).find(expectedWord => expectedWord == utteredWord))){
        trainingSuccess();
    }
    else if(utterance.split(splitRegex).length > 2){
        trainingSuccess();
    }
    else{
        expandTextPopup(null, "Sorry, the speech did not seem related to the training phrase. Please try again.");
    }
}

function trainingSuccess(){
    training_index++;
    updateTrainingStatus();
}

function resetTrainingStatus(){
    training_index = 0;
}

function updateTrainingStatus(){
    let training_elements = document.querySelectorAll(".voiceTrainingPage .form-check");
    training_elements.forEach((e, idx) => {
        console.log(e, idx);
        if(idx < training_index){
            e.className = "form-check completed";
        }
        else if(idx == training_index){
            e.className = "form-check training";
        }
        else{
            e.className = "form-check waiting";
        }
        
    });
}