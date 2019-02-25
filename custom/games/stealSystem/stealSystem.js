/**
 * stealSystem.js
 *
 * A command that will let you steal another users points.
 *
 * Current version 1.0.0
 * 
 * Original author: Dakoda
 * 
 * Contributors:
 * Wildwolf_live
 *
 */
(function() {
    var StealSenderCounter,
        StealTargetCounter;
        
	var minSteal = $.getSetIniDbNumber('stealSettings', 'minSteal', 1),
		maxSteal = $.getSetIniDbNumber('stealSettings', 'maxSteal', 100);

	/**
     * @function reloadSteal
     */
	function reloadSteal() {
		minSteal = $.getIniDbNumber('stealSettings', 'minSteal');
        maxSteal = $.getIniDbNumber('stealSettings', 'maxSteal');
    }

    /*
     * @function pushStealSender
     * @info Pushes the entire StealSender list.
     */
    function pushStealSender() {
    	var StealSenderID,
    		StealSenderResponce = [];

        for (StealSenderID = 1; $.lang.exists('steal.sender.steals.' + StealSenderID); StealSenderID++) {
            StealSenderResponce.push($.lang.get('steal.sender.steals.' + StealSenderID));            
        }
        StealSenderCounter = StealSenderID;

        $.consoleDebug($.lang.get('steal.sender.steals.loaded', StealSenderCounter - 1));
    }

    /*
     * @function pushStealTarget
     * @info Pushes the entire StealTarget list.
     */
    function pushStealTarget() {
    	var StealTargetID,
    		StealTargetResponce = [];

        for (StealTargetID = 1; $.lang.exists('steal.target.steals.' + StealTargetID); StealTargetID++) {
            StealTargetResponce.push($.lang.get('steal.target.steals.' + StealTargetID));
        }
        StealTargetCounter = StealTargetID;

        $.consoleDebug($.lang.get('steal.target.steals.loaded', StealTargetCounter - 1));
    }

    /*
     * @function pushStealing
     * @info Pushes the entire stealing list.
     */
    function pushStealing() {
    	pushStealSender();
    	pushStealTarget();
    }
    
    /**
     * @function getRandomInt
     */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

	/**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            argsString = event.getArguments(),
            args = event.getArgs(),
            action = args[0],
            actionInt = parseInt(args[1]);

		if (command.equalsIgnoreCase('steal')) {
			if (!action) {
                var randInt = getRandomInt(minSteal, maxSteal);
                if (randInt > $.getUserPoints($.botName.toLowerCase())) {
                    $.say($.whisperPrefix(sender) + $.lang.get('steal.user.nopoints', $.botName, $.getPointsString()));
                } else {
                    if (randInt > $.getUserPoints(sender)) {
                        $.say($.whisperPrefix(sender) + $.lang.get('steal.user.nopoints', $.username.resolve(sender), $.getPointsString()));
                    } else {
                        var whoSteals = getRandomInt(1, 100);
                        if (whoSteals > 75) {
                            $.say($.whisperPrefix(sender) + $.lang.get('steal.tryme', $.getPointsString(randInt), $.botName));
                            $.inidb.decr('points', sender, randInt);
                            $.inidb.incr('points', $.botName, randInt);
                            setTimeout(function() {
                                randomNumber = $.randRange(1, StealTargetCounter - 1);
                                $.say($.whisperPrefix(sender) + $.lang.get('steal.target.steals.'+randomNumber, $.getPointsString(randInt), $.botName));
                            }, 5e3);
                        } else {
                            $.say($.whisperPrefix(sender) + $.lang.get('steal.tryme', $.getPointsString(randInt), $.botName));
                            $.inidb.decr('points', $.botName, randInt);
                            $.inidb.incr('points', sender, randInt);
                            setTimeout(function() {
                                randomNumber = $.randRange(1, StealSenderCounter - 1);
                                $.say($.whisperPrefix(sender) + $.lang.get('steal.sender.steals.'+randomNumber, $.getPointsString(randInt), $.botName));
                            }, 5e3);
                        }
                    }
                }
                return;
            } else {
                if (action.equalsIgnoreCase('min')) {
                    if (!actionInt) { 
                        $.say($.whisperPrefix(sender) + $.lang.get('steal.min.usage'));
                    } else {
                        $.setIniDbNumber('stealSettings', 'minSteal', actionInt);
                        reloadSteal();
                        $.say($.whisperPrefix(sender) + $.lang.get('steal.min.success', actionInt));
                    }
                    return;
                }

                if (action.equalsIgnoreCase('max')) {
                    if (!actionInt) { 
                        $.say($.whisperPrefix(sender) + $.lang.get('steal.max.usage'));
                    } else {
                        $.setIniDbNumber('stealSettings', 'maxSteal', actionInt);
                        reloadSteal();
                        $.say($.whisperPrefix(sender) + $.lang.get('steal.max.success', actionInt));
                    }
                    return;
                }
            
                if ($.userExists(action)) {
                    var randInt = getRandomInt(minSteal, maxSteal);
                    if (randInt > $.getUserPoints(action)) {
                        $.say($.whisperPrefix(sender) + $.lang.get('steal.user.nopoints', $.username.resolve(action), $.getPointsString()));
                    } else {
                        if (randInt > $.getUserPoints(sender)) {
                            $.say($.whisperPrefix(sender) + $.lang.get('steal.user.nopoints', $.username.resolve(sender), $.getPointsString()));
                        } else {
                            $.say($.whisperPrefix(sender) + $.lang.get('steal.tryme', $.getPointsString(randInt), action));
                            var whoSteals = getRandomInt(1, 100);
                            if (whoSteals > 75) {
                                $.inidb.decr('points', sender, randInt);
                                $.inidb.incr('points', action, randInt);
                                setTimeout(function() {
                                    randomNumber = $.randRange(1, StealTargetCounter - 1);
                                    $.say($.whisperPrefix(sender) + $.lang.get('steal.target.steals.'+randomNumber, $.getPointsString(randInt), action));
                                }, 5e3);                               
                            } else {
                                $.inidb.decr('points', action, randInt);
                                $.inidb.incr('points', sender, randInt);
                                setTimeout(function() {
                                    randomNumber = $.randRange(1, StealSenderCounter - 1);
                                    $.say($.whisperPrefix(sender) + $.lang.get('steal.sender.steals.'+randomNumber, $.getPointsString(randInt), sender));
                                }, 5e3);                                
                            }
                        }
                    }
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('steal.nouser.usage', action));
                }
            }
		}
	});

	/**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/games/stealSystem.js')) {
            $.registerChatCommand('./custom/games/stealSystem.js', 'steal', 7);
            $.registerChatSubcommand('steal', 'min', 1);
            $.registerChatSubcommand('steal', 'max', 1);
        }

        pushStealing();
    });
    
    $.reloadSteal = reloadSteal;
})();
