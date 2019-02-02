/**
 * dailySystem.js
 *
 * A command that can be ran onces a day.
 *
 * Current version 1.1.0
 *
 * Original author: Dakoda
 *
 * Contributors:
 * ImChrisP
 *
 */
(function() {
	var // General variables
		baseCommand = $.getSetIniDbString('dailySettings', 'baseCommand', 'daily'),
		liveToggle = $.getSetIniDbBoolean('dailySettings', 'liveToggle', true),
		min0Pay = $.getSetIniDbNumber('dailySettings', 'min0Pay', 800),
		max0Pay = $.getSetIniDbNumber('dailySettings', 'max0Pay', 50000),
		min1Pay = $.getSetIniDbNumber('dailySettings', 'min1Pay', 700),
		max1Pay = $.getSetIniDbNumber('dailySettings', 'max1Pay', 40000),
		min2Pay = $.getSetIniDbNumber('dailySettings', 'min2Pay', 600),
		max2Pay = $.getSetIniDbNumber('dailySettings', 'max2Pay', 30000),
		min3Pay = $.getSetIniDbNumber('dailySettings', 'min3Pay', 500),
		max3Pay = $.getSetIniDbNumber('dailySettings', 'max3Pay', 25000),
		min4Pay = $.getSetIniDbNumber('dailySettings', 'min4Pay', 400),
		max4Pay = $.getSetIniDbNumber('dailySettings', 'max4Pay', 20000),
		min5Pay = $.getSetIniDbNumber('dailySettings', 'min5Pay', 300),
		max5Pay = $.getSetIniDbNumber('dailySettings', 'max5Pay', 15000),
		min6Pay = $.getSetIniDbNumber('dailySettings', 'min6Pay', 200),
		max6Pay = $.getSetIniDbNumber('dailySettings', 'max6Pay', 10000),
		min7Pay = $.getSetIniDbNumber('dailySettings', 'min7Pay', 100),
		max7Pay = $.getSetIniDbNumber('dailySettings', 'max7Pay', 5000);

	/**
     * @function reloadDaily
     */
	function reloadDaily() {
		var newCommand = $.getSetIniDbString('dailySettings', 'baseCommand', 'daily');
			newCommand = newCommand.toLowerCase();
		if (newCommand != baseCommand) {
			if (!$.commandExists(newCommand)) {
				var permBase = $.inidb.get('permcom', baseCommand);
				var permSet = $.inidb.get('permcom', baseCommand + ' set');
				$.unregisterChatSubcommand(baseCommand, 'set');
				$.unregisterChatCommand(baseCommand);
				baseCommand = newCommand;
				$.registerChatCommand('./custom/systems/dailySystem.js', baseCommand, permBase);
				$.registerChatSubcommand(baseCommand, 'set', permSet);
			} else {
				$.inidb.set('dailySettings', 'baseCommand', baseCommand);
				$.consoleDebug($.lang.get('dailysystem.set.basecommand.failed', newCommand));
			}
		}
		liveToggle = $.getIniDbBoolean('dailySettings', 'liveToggle'),
		min0Pay = $.getIniDbNumber('dailySettings', 'min0Pay', 1),
		max0Pay = $.getIniDbNumber('dailySettings', 'max0Pay', 5),
		min1Pay = $.getIniDbNumber('dailySettings', 'min1Pay', 1),
		max1Pay = $.getIniDbNumber('dailySettings', 'max1Pay', 5),
		min2Pay = $.getIniDbNumber('dailySettings', 'min2Pay', 1),
		max2Pay = $.getIniDbNumber('dailySettings', 'max2Pay', 5),
		min3Pay = $.getIniDbNumber('dailySettings', 'min3Pay', 1),
		max3Pay = $.getIniDbNumber('dailySettings', 'max3Pay', 5),
		min4Pay = $.getIniDbNumber('dailySettings', 'min4Pay', 1),
		max4Pay = $.getIniDbNumber('dailySettings', 'max4Pay', 5),
		min5Pay = $.getIniDbNumber('dailySettings', 'min5Pay', 1),
		max5Pay = $.getIniDbNumber('dailySettings', 'max5Pay', 5),
		min6Pay = $.getIniDbNumber('dailySettings', 'min6Pay', 1),
		max6Pay = $.getIniDbNumber('dailySettings', 'max6Pay', 5),
		min7Pay = $.getIniDbNumber('dailySettings', 'min7Pay', 1),
		max7Pay = $.getIniDbNumber('dailySettings', 'max7Pay', 5);
	}

	function formatDate(dateIn) {
	   var yyyy = dateIn.getFullYear();
	   var mm = dateIn.getMonth()+1; // getMonth() is zero-based
	   var dd  = dateIn.getDate();
	   return String(10000*yyyy + 100*mm + dd); // Leading zeros for mm and dd
	}

	function runDailyPayout(sender, userRank) {
		var randomNumber;
		if (userRank == 7) {
			randomNumber = $.randRange(min7Pay, max7Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		} else if(userRank == 6) {
			randomNumber = $.randRange(min6Pay, max6Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		} else if(userRank == 5) {
			randomNumber = $.randRange(min5Pay, max5Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		} else if(userRank == 4) {
			randomNumber = $.randRange(min4Pay, max4Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		} else if(userRank == 3) {
			randomNumber = $.randRange(min3Pay, max3Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		} else if(userRank == 2) {
			randomNumber = $.randRange(min2Pay, max2Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		} else if(userRank == 1) {
			randomNumber = $.randRange(min1Pay, max1Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		} else {
			randomNumber = $.randRange(min0Pay, max0Pay);
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.payout', $.getPointsString(randomNumber)));
			$.inidb.incr('points', sender, randomNumber);
		}
	}

	/**
     * @event command
	 */
	$.bind('command', function (event) {
		var command = event.getCommand(),
            sender = event.getSender(),
			args = event.getArgs(),
            action = args[0];
			optionChoice = args[1];
			optionValue = args[2];
			optionValue2 = args[3];


		if (command.equalsIgnoreCase(baseCommand)) {
			if (action === undefined) {
				var userRank = $.getUserGroupId(sender);

				if ($.isOnline($.channelName) || !liveToggle) {
					var dateNow = new Date();
						dateNow = formatDate(dateNow);
					if ($.inidb.exists('dailyUsers', sender)) {
							newDay = $.getIniDbNumber('dailyUsers', sender);
						if (newDay >= dateNow) {
							$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.cooldown'));
						} else {
							runDailyPayout(sender, userRank);
							$.setIniDbNumber('dailyUsers', sender, dateNow);
						}
						return;
					} else {
						runDailyPayout(sender, userRank);
						$.setIniDbNumber('dailyUsers', sender, dateNow);
						return;
					}
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.offline', baseCommand, $.channelName));
					return;
				}
			}

			/**
             * @commandpath "baseCommand" set - Base command for controlling the daily settings
             */
			if (action.equalsIgnoreCase('set')) {
				if (optionChoice === undefined) {
					$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.usage', baseCommand));
					return;
				}

				/**
				 * @commandpath "baseCommand" set [UserGroupId] [integer] - Used to set the amount of currency won for the daily. Set to 0 to disable.
				 */
				if (optionChoice.trim().matches("[0-9]+")){
					if ($.bot.isModuleEnabled('./systems/pointSystem.js')) {
						if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0) || isNaN(optionValue2) || (optionValue2 < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.usage', baseCommand, $.getPointsString(minSubPay), $.getPointsString(maxSubPay)));
							return;
						} else {
							if ($.inidb.exists('dailySettings', 'min'+optionChoice+'Pay') && $.inidb.exists('dailySettings', 'max'+optionChoice+'Pay')) {
								minSubPay = parseInt(optionValue);
								maxSubPay = parseInt(optionValue2);
								$.inidb.set('dailySettings', 'min'+optionChoice+'Pay', minSubPay);
								$.inidb.set('dailySettings', 'max'+optionChoice+'Pay', maxSubPay);
								$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.success', $.getGroupNameById(optionChoice), $.getPointsString(minSubPay), $.getPointsString(maxSubPay)));
								reloadDaily();
							} else {
								$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.fail', optionChoice));
							}
							return;
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.usage.pointsystem', './systems/pointSystem.js'));
					}
				}

				/**
				 * @commandpath "baseCommand" set baseCommand [string] - Used to set the base command for the daily system.
				 */
				if (optionChoice.trim().equalsIgnoreCase('basecommand')){
					if (optionValue === undefined) {
						$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.basecommand.usage', baseCommand));
						return;
					} else {
						optionValue = $.replace(optionValue,'!','');
						optionValue = optionValue.toLowerCase();
						if (optionValue != baseCommand) {
							if (!$.commandExists(optionValue)) {
								var permBase = $.inidb.get('permcom', baseCommand);
								var permSet = $.inidb.get('permcom', baseCommand + ' set');
								$.unregisterChatSubcommand(baseCommand, 'set');
								$.unregisterChatCommand(baseCommand);
								baseCommand = optionValue;
								$.inidb.set('dailySettings', 'baseCommand', baseCommand);
								$.registerChatCommand('./custom/systems/dailySystem.js', baseCommand, permBase);
								$.registerChatSubcommand(baseCommand, 'set', permSet);
								$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.basecommand.success', baseCommand));
							} else {
								$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.basecommand.failed', optionValue));
							}
						}
						return;
					}
				}
				/**
				 * @commandpath "baseCommand" set [undefined option] - Show usage.
				 */
				$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.set.usage', baseCommand));
				return;
			}
			$.say($.whisperPrefix(sender) + $.lang.get('dailysystem.daily.usage', baseCommand));
			return;

		}

		if (command.equalsIgnoreCase('reloaddaily')) {
	        reloadDaily();
	    }
	});

	/**
     * @event initReady
     */
    $.bind('initReady', function() {
		if($.bot.isModuleEnabled('./custom/systems/dailySystem.js')){
			// Register commands
			$.registerChatCommand('./custom/systems/dailySystem.js', baseCommand, 7);
			$.registerChatSubcommand(baseCommand, 'set', 1);

			$.registerChatCommand('./custom/systems/dailySystem.js', 'reloaddaily', 30);
			/**
			 * Warn the user if the points system is disabled and this is enabled.
			 */
			if (!$.bot.isModuleEnabled('./systems/pointSystem.js')) {
				$.log.warn("./systems/pointSystem.js is not enabled. Daily will be disabled.");
			}
		}
    });

	$.reloadDaily = reloadDaily;
})();