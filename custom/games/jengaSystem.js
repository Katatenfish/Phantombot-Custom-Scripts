/**
 * jengaSystem.js
 *
 * Command handler for a cute little mini game.
 * Add new game that users can play jenga <3.
 */
(function() {
    var currency = null,
        require = null,
        amountSucceed = $.getSetIniDbNumber('jenga', 'succeed', 20),
        amountFail = $.getSetIniDbNumber('jenga', 'fail', 5),
        chance = $.getSetIniDbNumber('jenga', 'chance', 50),
        cooldown = $.getSetIniDbNumber('jenga', 'cooldown', 120),
        lastRollSucceed = $.getSetIniDbBoolean('jenga', 'lastRollSucceed', false),
        lastRollFail = $.getSetIniDbBoolean('jenga', 'lastRollFail', false),
        lastRoller = $.getSetIniDbString('jenga', 'lastRoller', null),
        lastRollerSucceed = $.getSetIniDbString('jenga', 'lastRollerSucceed', null),
        lastRollerFail = $.getSetIniDbString('jenga', 'lastRollerFail', null);

    function reloadJenga() {
        lastRollSucceed = $.getIniDbBoolean('jenga', 'lastRollSucceed'),
        lastRollFail = $.getIniDbBoolean('jenga', 'lastRollFail'),
        lastRoller = $.getIniDbString('jenga', 'lastRoller'),
        lastRollerSucceed = $.getIniDbString('jenga', 'lastRollerSucceed'),
        lastRollerFail = $.getIniDbString('jenga', 'lastRollerFail');
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            random;

        var ranked_sender = $.username.resolve(sender),
            points_sender = $.inidb.get('points', sender);

        /**
         * @commandpath jenga ?last - knock down the a jenga, or retrieve the last result
         */
        if (command.equalsIgnoreCase('jenga')) {
            if (!action) {
                if (lastRoller == sender) {
                    $.say($.lang.get('jenga.sender.last', ranked_sender));
                } else {
                    if (points_sender >= amountFail) {
                        random = $.randRange(1, 100);
                        if (random >= chance) {
                            currency = $.getPointsString(amountFail);

                            $.say($.lang.get('jenga.fail', ranked_sender, lastRollerSucceed, currency));
                            lastRollerFail = $.setIniDbString('jenga', 'lastRollerFail', sender);
                            lastRoller = $.setIniDbString('jenga', 'lastRoller', sender),
                            lastRollFail = $.setIniDbBoolean('jenga', 'lastRollFail', true);

                            $.inidb.decr('points', sender, amountFail);
                            $.inidb.incr('points', lastRollerSucceed, amountFail);

                            $.coolDown.set('jenga', false, cooldown, false);
                            setTimeout(function() {
                                $.say($.lang.get('jenga.reset'));
                            }, cooldown*1000);
                        } else {
                            currency = $.getPointsString(amountSucceed);

                            $.say($.lang.get('jenga.succeed', ranked_sender, currency));
                            lastRollerSucceed = $.setIniDbString('jenga', 'lastRollerSucceed', sender);
                            lastRoller = $.setIniDbString('jenga', 'lastRoller', sender);
                            lastRollSucceed = $.setIniDbBoolean('jenga', 'lastRollSucceed', true);

                            $.inidb.incr('points', sender, amountSucceed);
                        }
                    } else {
                        currency = $.getPointsString(points_sender);
                        require = $.getPointsString(amountFail);

                        $.say($.lang.get('jenga.nopoints', ranked_sender, currency, require));
                    }
                    reloadJenga();
                    return;
                }
                reloadJenga();
                return;
            }

            if (action.equalsIgnoreCase('fail')) {
                reloadJenga();
                if (!lastRollFail) {
                    $.say($.lang.get('jenga.no_last.fail', ranked_sender));
                } else {
                    if (lastRollerFail == sender) {
                        $.say($.lang.get('jenga.last.fail', ranked_sender, 'you'));
                    } else {
                        $.say($.lang.get('jenga.last.fail', ranked_sender, lastRollerFail));
                    }
                }
                return;
            }

            if (action.equalsIgnoreCase('succeed')) {
                reloadJenga();
                if (!lastRollSucceed) {
                    $.say($.lang.get('jenga.no_last.succeed', ranked_sender));
                } else {
                    if (lastRollerSucceed == sender) {
                        $.say($.lang.get('jenga.last.succeed', ranked_sender, 'you'));
                    } else {
                        $.say($.lang.get('jenga.last.succeed', ranked_sender, lastRollerSucceed));
                    }
                }
                return;
            }
        }

        if (command.equalsIgnoreCase('jengawin')) {
            if (!isNaN(action)) {
                amountSucceed = $.getSetIniDbNumber('jenga', 'succeed', action);
                $.setIniDbNumber('jenga', 'succeed', action);
                $.say($.lang.get('jenga.set.succeed', ranked_sender, amountSucceed));
            }
        }

        if (command.equalsIgnoreCase('jengalose')) {
            if (!isNaN(action)) {
                $.setIniDbNumber('jenga', 'fail', action);
                amountFail = $.getSetIniDbNumber('jenga', 'fail', action);
                $.say($.lang.get('jenga.set.fail', ranked_sender, amountFail));
            }
        }

        if (command.equalsIgnoreCase('jengachance')) {
            if (!isNaN(action)) {
                $.setIniDbNumber('jenga', 'chance', action);
                chance = $.getSetIniDbNumber('jenga', 'chance', action);
                $.say($.lang.get('jenga.set.chance', ranked_sender, chance));
            }
        }

        if (command.equalsIgnoreCase('jengacd')) {
            if (!isNaN(action)) {
                $.setIniDbNumber('jenga', 'cooldown', action);
                cooldown = $.getSetIniDbNumber('jenga', 'cooldown', action);
                $.say($.lang.get('jenga.set.cooldown', ranked_sender, cooldown));
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/jengaSystem.js')){
            $.registerChatCommand('./custom/games/jengaSystem.js', 'jenga', 7);
            $.registerChatSubcommand('jenga', 'fail', 1);
            $.registerChatSubcommand('jenga', 'succeed', 1);

            $.registerChatCommand('./custom/games/jengaSystem.js', 'jengawin', 2);
            $.registerChatCommand('./custom/games/jengaSystem.js', 'jengalose', 2);
            $.registerChatCommand('./custom/games/jengaSystem.js', 'jengachance', 2);
            $.registerChatCommand('./custom/games/jengaSystem.js', 'jengacd', 2);
        }
    });
})();