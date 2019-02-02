/**
 * tg-goPlay.js
 *
 * A simple module allowing the user the increase their tamagotchi's mood in exchange for food.
 */
(function() {
    var //set the variables needed 
        funLevelIncr = $.getSetIniDbNumber('tamagotchi_GoPlaySettings', 'funLevelIncr', 0.10),
        expLevelIncr = $.getSetIniDbNumber('tamagotchi_GoPlaySettings', 'expLevelIncr', 1.5),
        foodLevelDecr = $.getSetIniDbNumber('tamagotchi_GoPlaySettings', 'foodLevelDecr', 1),
        locationCount = 0,
        lastRandom = -1;

    /**
     * @function reloadGoPlaySettings
     */
    function reloadGoPlaySettings() {
        funLevelIncr = $.getIniDbNumber('tamagotchi_GoPlaySettings', 'funLevelIncr'),
        expLevelIncr = $.getIniDbNumber('tamagotchi_GoPlaySettings', 'expLevelIncr'),
        foodLevelDecr = $.getIniDbNumber('tamagotchi_GoPlaySettings', 'foodLevelDecr');
    }

    /**
     * @function loadLocations
     */
    function loadLocations() {
        for (var i = 1; $.lang.exists('tgplay.play.' + i); i++) {
            locationCount++;
        }

        $.consoleDebug($.lang.get('tgplay.console.loaded', locationCount));
    }

    /**
     * @function getLocationLangKey
     * @returns {string}
     */
    function getLocationLangKey() {
        var rand;

        do {
            rand = $.randRange(1, locationCount);
        } while (rand == lastRandom);

        lastRandom = rand;

        return 'tgplay.play.' + rand;
    }

    /**
     * @function runPlay
     * @param {string} caller
     */
    function runPlay(caller) {
        var callerTG = $.tamagotchi.getByOwner(caller);

        if (!callerTG) {
            $.tamagotchi.say404(caller);
            return;
        }


        $.say($.lang.get(getLocationLangKey(), callerTG.name));

        callerTG
            .incrExpLevel(expLevelIncr)
            .incrFunLevel(funLevelIncr)
            .decrFoodLevel(foodLevelDecr)
            .save();
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var command = event.getCommand(),
            sender = event.getSender().toLowerCase();

        if (command.equalsIgnoreCase('tgplay')) {
            if ($.tamagotchi.tgExists(sender)) {
                runPlay(sender);
            } else {
                $.tamagotchi.say404(sender);
            }
        }

        if (command.equalsIgnoreCase('reloadgoplaysettings')) {
            reloadGoPlaySettings();
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/tamagotchi/tg-goPlay.js')){
            loadLocations();
            $.registerChatCommand('./custom/games/tamagotchi/tg-goPlay.js', 'tgplay', 6);

            $.registerChatCommand('./custom/games/tamagotchi/tg-goPlay.js', 'reloadgoplaysettings', 30);
        }
    });
})();