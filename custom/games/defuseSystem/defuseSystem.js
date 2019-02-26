/**
 * defuseSystem.js
 *
 * A Game that will let you defuse the bomb!.
 */

(function() {
    var firstWire = $.getSetIniDbString('defuseSettings', 'firstWire', 'blue'),
        secondWire = $.getSetIniDbString('defuseSettings', 'secondWire', 'red'),
        thirdWire = $.getSetIniDbString('defuseSettings', 'thirdWire', 'yellow');

    function reloadDefuse() {
        firstWire = $.getIniDbString('defuseSettings', 'firstWire'),
        secondWire = $.getIniDbString('defuseSettings', 'secondWire'),
        thirdWire = $.getIniDbString('defuseSettings', 'thirdWire');
    }

    function in_array(needle, haystack){
        for (var i=0, len=haystack.length;i<len;i++) {
            if (haystack[i] == needle) return i;
        }
        return -1;
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0];

        var ranked_sender = $.username.resolve(sender),
            cost = $.getSetIniDbNumber('pricecom', 'defuse', 10),
            amount = cost*2,
            winnings = $.getPointsString(amount),
            losings = $.getPointsString(cost);

        //Todo List
        if (command.equalsIgnoreCase('defuse')) {
            if (!action) {
                $.say($.lang.get('defuse.nowire', ranked_sender, $.pointNameMultiple));
            } else {
                var wires = [firstWire.toLowerCase, secondWire.toLowerCase, thirdWire.toLowerCase];
                if (in_array(action.toLowerCase(),wires) != -1) {
                    var singleWire = wires[Math.floor(Math.random() * wires.length)];
                    $.say($.lang.get('defuse.pass', ranked_sender, action));
                    setTimeout(function() {
                        if (action.toLowerCase() == singleWire) {
                            $.say($.lang.get('defuse.win', ranked_sender, winnings));
                            $.inidb.incr('points', sender.toLowerCase(), amount);
                        } else {
                            $.say($.lang.get('defuse.lose', ranked_sender, losings));
                        }
                    }, 5e3);
                } else {
                    $.say($.lang.get('defuse.nocolor', ranked_sender));
                }
            }
        }

    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/defuseSystem.js')){
            $.registerChatCommand('./custom/games/defuseSystem.js', 'defuse', 7);
        }
    });

    $.reloadDefuse = reloadDefuse;
})();
