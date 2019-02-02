/**
 * tg-hug.js
 *
 * Enable tamagotchi owners to use their tamagotchi for hugging.
 */
(function() {
    var //set the variables needed 
        funLevelIncr = $.getSetIniDbNumber('tamagotchi_HugSettings', 'funLevelIncr', 0.1),
        expLevelIncr = $.getSetIniDbNumber('tamagotchi_HugSettings', 'expLevelIncr', 0.25),
        foodLevelDecr = $.getSetIniDbNumber('tamagotchi_HugSettings', 'foodLevelDecr', 0.1);

    /**
     * @function reloadHugSettings
     */
    function reloadHugSettings() {
        funLevelIncr = $.getIniDbNumber('tamagotchi_HugSettings', 'funLevelIncr'),
        expLevelIncr = $.getIniDbNumber('tamagotchi_HugSettings', 'expLevelIncr'),
        foodLevelDecr = $.getIniDbNumber('tamagotchi_HugSettings', 'foodLevelDecr');
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var command = event.getCommand(),
            sender = event.getSender(),
            args = event.getArgs();

        /**
         * @commandpath tghug [username] - HAve your tamagotchi hug another user's tamagotchi. If the target user does not have a tamagotchi, your tamagotchi will hug the user instead.
         */
        if (command.equalsIgnoreCase('tghug')) {
            if (args.length != 1 || sender.equalsIgnoreCase(args[0])) {
                $.say($.whisperPrefix(sender) + $.lang.get('tghug.usage'));
                return;
            }

            var senderTG = $.tamagotchi.getByOwner(sender),
                targetTG = $.tamagotchi.getByOwner(args[0]);

            if (!senderTG) {
                $.tamagotchi.say404(sender);
                return;
            }

            if (!senderTG.isHappy()) {
                senderTG.sayFunLevel();
                $.say($.lang.get('tghug.nothappy', senderTG.name));
                return;
            }

            senderTG
                .incrExpLevel(expLevelIncr)
                .incrFunLevel(funLevelIncr)
                .decrFoodLevel(foodLevelDecr)
                .save();

            if (!targetTG) {
                $.say($.lang.get('tghug.gouser', senderTG.name, $.username.resolve(args[0]), $.username.resolve(sender)));
                return;
            }

            targetTG.incrFunLevel(funLevelIncr).save();

            $.say($.lang.get('tghug.go', senderTG.name, targetTG.name, targetTG.getSexString()));
        }

        if (command.equalsIgnoreCase('reloadhugsettings')) {
            reloadHugSettings();
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/tamagotchi/tg-hug.js')){
            $.registerChatCommand('./custom/games/tamagotchi/tg-hug.js', 'tghug', 6);

            $.registerChatCommand('./custom/games/tamagotchi/tg-hug.js', 'reloadhugsettings', 30);
        }
    });
})();