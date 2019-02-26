/**
 * lottoSystem.js
 *
 * Command handler for a lottery system!
 */
(function() {
    var multiplier,
        currency,
        cost;

    /**
     * @function getRandomInt
     */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    /**
     * @function contains
     */
    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == obj) {
                return true;
            }
        }
        return false;
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            intAction1 = parseInt(args[0]);

        var rand1 = getRandomInt(1, 59),
            rand2 = getRandomInt(1, 59),
            rand3 = getRandomInt(1, 59),
            rand4 = getRandomInt(1, 59),
            rand5 = getRandomInt(1, 59),
            rand6 = getRandomInt(1, 59);
            loto = [rand1, rand2, rand3, rand4, rand5, rand6],
            picked = contains(loto, intAction1),
            ranked_sender = $.username.resolve(sender);

        if (command.equalsIgnoreCase('lotto')) {
            if (intAction1 < 59) {
                multiplier = getRandomInt(1, 3);
                cost = $.getSetIniDbNumber('pricecom', 'lotto', 10);
                if (picked == true) {
                    currency = $.getPointsString(multiplier * cost);
                    $.say($.lang.get('lotto.try', ranked_sender, intAction1, loto.join(', '), currency));
                    setTimeout(function() {
                        $.say($.lang.get('lotto.pass', ranked_sender, currency));
                        $.inidb.incr('points', sender.toLowerCase(), currency);
                    }, 12e2);
                } else {
                    currency = $.getPointsString(multiplier * cost);
                    $.say($.lang.get('lotto.try', ranked_sender, intAction1, loto.join(', '), currency));
                    setTimeout(function() {
                        $.say($.lang.get('lotto.fail', ranked_sender));
                    }, 12e2);
                }
                return;
            } else {
                $.say($.lang.get('lotto.useage', ranked_sender));
                return;
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/lottoSystem.js')){
            $.registerChatCommand('./custom/games/lottoSystem.js', 'lotto', 2);
        }
    });
})();