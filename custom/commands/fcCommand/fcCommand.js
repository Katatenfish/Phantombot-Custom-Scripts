/**
 * fcCommand.js
 *
 * Command handler to say a custom friendcode based on the current system.
 * Add new game definitions to the getFriendCode switch statement.
 */
(function() {
    var system = $.getSetIniDbString('fcSettings', 'system', 'switch');

    function reloadSettings() {
        system = $.getIniDbString('fcSettings', 'system');
    }

    function getFriendCode(system) {
        switch (system) {
            case "3ds":
                return "A cool name";
            case "switch":
                return "Another cool name";
            default: // Default means if the string game does not match any of the existing cases. keep this.
                return "Another name";
        }
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            action2 = args[1];

        if (command.equalsIgnoreCase('fc')) {
            if (!action) {
                $.say($.lang.get('fc.current', getFriendCode(system.toLowerCase())));
                return;
            } else {
                if (action.equalsIgnoreCase('system')) {
                    if (action2 !== undefined) {
                        $.setIniDbString('fcSettings', 'system', action2.toLowerCase());
                        $.say($.lang.get('fc.update', action2));
                        reloadSettings();
                    } else {
                        $.say($.lang.get('fc.usage', sender));
                    }
                } else {
                    var fcUser = $.getIniDbString('fcUsers', action.replace("@", "").toLowerCase());
                    if (fcUser !== undefined) {
                        $.say($.lang.get('fc.check', action, fcUser));
                    } else {
                        $.say($.lang.get('fc.null', action));
                    }
                }
            }
        }

        if (command.equalsIgnoreCase('myfc')) {
            if (!action) {
                var fcUser = $.getIniDbString('fcUsers', sender);
                if (fcUser !== undefined) {
                    $.say($.lang.get('myfc.current', sender, fcUser));
                } else {
                    $.say($.lang.get('myfc.null', sender));
                }
            } else {
                $.setIniDbString('fcUsers', sender, action);
                $.say($.lang.get('myfc.update', sender, action));
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/commands/fcCommand.js')){
            $.registerChatCommand('./custom/commands/fcCommand.js', 'fc', 2);
            $.registerChatSubcommand('fc', 'system', 1);

            $.registerChatCommand('./custom/commands/fcCommand.js', 'myfc', 7);
        }
    });
})();