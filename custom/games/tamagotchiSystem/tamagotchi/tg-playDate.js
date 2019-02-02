/**
 * tg-playdate.js
 *
 * Enable viewers to have their tamagotchis go on a playdate for increasing mood levels.
 */
(function() {
    var //set the variables needed 
        funLevelIncr = $.getSetIniDbNumber('tamagotchi_PlayDateSettings', 'funLevelIncr', 3),
        expLevelIncr = $.getSetIniDbNumber('tamagotchi_PlayDateSettings', 'expLevelIncr', 0.25),
        foodLevelDecr = $.getSetIniDbNumber('tamagotchi_PlayDateSettings', 'foodLevelDecr', 0.5),
        locationCount = 0,
        lastRandom = -1;

    /**
     * @function reloadPlayDateSettings
     */
    function reloadPlayDateSettings() {
        funLevelIncr = $.getIniDbNumber('tamagotchi_PlayDateSettings', 'funLevelIncr'),
        expLevelIncr = $.getIniDbNumber('tamagotchi_PlayDateSettings', 'expLevelIncr'),
        foodLevelDecr = $.getIniDbNumber('tamagotchi_PlayDateSettings', 'foodLevelDecr');
    }

    /**
     * @function loadLocations
     */
    function loadLocations() {
        for (var i = 1; $.lang.exists('tgplaydate.playdatelocation.' + i); i++) {
            locationCount++;
        }

        $.consoleDebug($.lang.get('tgplaydate.console.loaded', locationCount));
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

        return 'tgplaydate.playdatelocation.' + rand;
    }

    /**
     * @function runPlayDate
     * @param {string} caller
     * @param {string} target
     */
    function runPlayDate(caller, target) {
        var callerTG = $.tamagotchi.getByOwner(caller),
            targetTG = $.tamagotchi.getByOwner(target);

        if (!callerTG) {
            $.tamagotchi.say404(caller);
            return;
        }

        if (!targetTG) {
            $.say($.whisperPrefix(caller) + $.lang.get('tgplaydate.target.404', $.username.resolve(target)));
            return;
        }

        if (targetTG.foodLevel < 1 + foodLevelDecr) {
            targetTG.sayFoodLevelTooLow();
            return;
        }

        $.say($.lang.get(getLocationLangKey(), targetTG.name, callerTG.name));

        callerTG
            .incrFunLevel(funLevelIncr)
            .incrExpLevel(expLevelIncr)
            .decrFoodLevel(foodLevelDecr)
            .save();
        targetTG
            .incrFunLevel(funLevelIncr)
            .incrExpLevel(expLevelIncr)
            .decrFoodLevel(foodLevelDecr)
            .save();
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var command = event.getCommand(),
            sender = event.getSender().toLowerCase(),
            args = event.getArgs();

        if (command.equalsIgnoreCase('tgplaydate')) {
            if (args.length != 1 || sender.equalsIgnoreCase(args[0])) {
                $.say($.whisperPrefix(sender) + $.lang.get('tgplaydate.usage'));
                return;
            }

            runPlayDate(sender, (args[0] + '').toLowerCase());
        }

        if (command.equalsIgnoreCase('reloadplaydatesettings')) {
            reloadPlayDateSettings();
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/tamagotchi/tg-playDate.js')){
            loadLocations();
            $.registerChatCommand('./custom/games/tamagotchi/tg-playDate.js', 'tgplaydate', 6);

            $.registerChatCommand('./custom/games/tamagotchi/tg-playDate.js', 'reloadplaydatesettings', 30);
        }
    });
})();