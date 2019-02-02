/**
 * hackSystem.js
 *
 * A Game that will let you hack the bot!.
 */
(function() {
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            argsString = event.getArguments(),
            args = event.getArgs(),
            action = args[0];

        var ranked_sender = $.username.resolve(sender);

        //Todo List
        if (command.equalsIgnoreCase('hack')) {
            if (!action) {
                $.say($.lang.get('hack.password.fail', ranked_sender));
            } else {
                $.say($.lang.get('hack.password.pass', ranked_sender, argsString));
                setTimeout(function() {
		            var password = $.readFile('./addons/logFiles/hacker/passwords.txt');
	            	var rand = password[Math.floor(Math.random() * password.length)];
	            	if (argsString.toLowerCase() == rand.toLowerCase()) {
	            		$.say($.lang.get('hack.pass.win', ranked_sender, argsString, rand));
	            		return;
	            	}
	                $.say($.lang.get('hack.pass.lose', ranked_sender, argsString, rand));
		        }, 5e3);
            }
        }

    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/heistSystem.js')){
            $.registerChatCommand('./custom/games/hackSystem.js', 'hack', 7);
        }
    });
})();
