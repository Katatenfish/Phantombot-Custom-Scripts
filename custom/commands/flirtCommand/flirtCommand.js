/**
 * flirtCommand.js
 *
 * Viewers can show each other the love of REAL friends by expressing it in pain.
 */
(function() {
    var selfMessageCount = 0,
        otherMessageCount = 0,
        lastRandom = -1,
        lang,
        rand;

    /**
     * @function loadResponses
     */
    function loadResponses() {
        var i;
        for (i = 1; $.lang.exists('flirtcommand.self.' + i); i++) {
            selfMessageCount++;
        }
        for (i = 1; $.lang.exists('flirtcommand.other.' + i); i++) {
            otherMessageCount++;
        }
        $.consoleDebug($.lang.get('flirtcommand.console.loaded', selfMessageCount, otherMessageCount));
    }

    function selfflirt(sender) {
        do {
            rand = $.randRange(1, selfMessageCount);
        } while (rand == lastRandom);
        $.say($.lang.get('flirtcommand.self.' + rand, $.username.resolve(sender)));
        lastRandom = rand;
    }

    function flirt(sender, user) {
        do {
            rand = $.randRange(1, otherMessageCount);
        } while (rand == lastRandom);
        lang = $.lang.get('flirtcommand.other.' + rand, $.username.resolve(sender), $.username.resolve(user), $.botName);
		$.say(lang);
        lastRandom = rand;
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs();

        /**
         * @commandpath flirt [username] - flirt a fellow viewer (not for real!), omit the username to flirt yourself
         */
        if (command.equalsIgnoreCase('flirt')) {
            if (args.length <= 0 || args[0].toLowerCase() == sender) {
                selfflirt(sender);
            } else {
                flirt(sender, args[0]);
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/commands/flirtCommand.js')){
            if (selfMessageCount == 0 && otherMessageCount == 0) {
            loadResponses();
            }
            $.registerChatCommand('./custom/commands/flirtCommand.js', 'flirt', 7);
        }
    });
})();
