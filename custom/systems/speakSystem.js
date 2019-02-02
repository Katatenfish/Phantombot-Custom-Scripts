//Create text to speech object.
var TTS = {
    speak: function(inputText){//Define function getting & playing TTS
	var speechText = "<voice>" + inputText;
	//Post speech text.
	//$.say(speechText);
	$.panelsocketserver.alertImage(speechText);
    }
};
//Adding text to speech to PhantomBot
(function(){
    //Define function calling tts.
    function speak(textToSpeak){
	TTS.speak(textToSpeak);
    }
    
    /**
     * @event command
     */
    $.bind('command',function(event){
    	//Define cost of shouting and current amount of currency:
	    var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
	    	concatedArgs = "",
	    	allArgs = event.getArgs();

	    concatedArgs +=  sender + ": ";
        for (i = 0; i < allArgs.length; i++){
            concatedArgs += allArgs[i].replace(",", "") + " ";
        }
	    inputText = concatedArgs;

    	if (command.equalsIgnoreCase('tts')){
			speak(inputText);
		}
    });

	//Register command.
	$.bind('initReady',function(){
	    if($.bot.isModuleEnabled('./custom/systems/speakSystem.js')){
			$.registerChatCommand('./custom/systems/speakSystem.js','tts',7);
	    }
	});
})();