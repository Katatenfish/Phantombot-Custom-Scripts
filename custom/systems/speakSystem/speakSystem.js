//Adding text to speech to PhantomBot
(function(){
    
    /**
     * @event command
     */
    $.bind('command',function(event){
	    var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
	    	allArgs = event.getArgs();

	    var speechText =  sender + ": ";
        for (i = 0; i < allArgs.length; i++){
            speechText += allArgs[i].replace(",", "") + " ";
        }

    	if (command.equalsIgnoreCase('tts')){
			if (allArgs.length > 0) {
				$.panelsocketserver.triggerTextToSpeek(speechText);
			}
		}
    });

	//Register command.
	$.bind('initReady',function(){
	    if($.bot.isModuleEnabled('./custom/systems/speakSystem.js')){
			$.registerChatCommand('./custom/systems/speakSystem.js','tts',7);
	    }
	});
})();