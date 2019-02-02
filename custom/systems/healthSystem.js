/**
 * healthSystem.js
 *
 * A cool system for keeping yourself healthy.
 *
 * Current version 1.0.4
 * https://community.phantombot.tv/t/wellness-feature-then-some/3931
 *
 * Original author: Dakoda
 *
 * Contributors:
 * ShadowDragon7015, Khryztoepher, BantomPhot
 *
 */
(function(){
	var wellbeingCountReminder,
		wellbeingCountCommand;

	var // General Settings
		baseCommand = $.getSetIniDbString('healthSettings', 'baseCommand', 'health');

	var //Hydration Settings
		hydrationoz = $.getSetIniDbNumber('healthSettings', 'hydrationoz', 5),
		hydrationtimer = $.getSetIniDbNumber('healthSettings', 'hydrationtimer', 60),
		hydrationtoggle = $.getSetIniDbBoolean('healthSettings', 'hydration', true);

	var //Hunger Settings
		hungertimer = $.getSetIniDbNumber('healthSettings', 'hungertimer', 480),
		hungertoggle = $.getSetIniDbBoolean('healthSettings', 'hunger', true);

	var //Movement Settings
		movementtimer = $.getSetIniDbNumber('healthSettings', 'movementtimer', 120),
		movementtoggle = $.getSetIniDbBoolean('healthSettings', 'movement', true);

	var //Sleep Settings
		sleeptimer = $.getSetIniDbNumber('healthSettings', 'sleeptimer', 480),
		sleeptoggle = $.getSetIniDbBoolean('healthSettings', 'sleep', true);

	var //Wellbeing Settings
		wellbeingtimer = $.getSetIniDbNumber('healthSettings', 'wellbeingtimer', 60),
		wellbeingtoggle = $.getSetIniDbBoolean('healthSettings', 'wellbeing', true);

	/**
     * @function reloadHealth
     */
	function reloadHealth() {
		var newCommand = $.getSetIniDbString('healthSettings', 'baseCommand', 'health');
			newCommand = newCommand.toLowerCase();
		if (newCommand != baseCommand) {
			if (!$.commandExists(newCommand)) {
				// get commands permissions
				var permBase = $.getSetIniDbString('permcom', baseCommand);
				var permSetToggle = $.getSetIniDbString('permcom', baseCommand + ' toggle');
				var permSetHydration = $.getSetIniDbString('permcom', baseCommand + ' hydration');
				var permSetHunger = $.getSetIniDbString('permcom', baseCommand + ' hunger');
				var permSetMovement = $.getSetIniDbString('permcom', baseCommand + ' movement');
				var permSetSleep = $.getSetIniDbString('permcom', baseCommand + ' sleep');
				var permSetWellbeing = $.getSetIniDbString('permcom', baseCommand + ' wellbeing');
				var permBaseSettings = $.getSetIniDbString('permcom', baseCommand + 'settings');

				// unregister the old commands
				$.unregisterChatSubcommand(baseCommand, 'toggle');
				$.unregisterChatSubcommand(baseCommand, 'hydration');
				$.unregisterChatSubcommand(baseCommand, 'hunger');
				$.unregisterChatSubcommand(baseCommand, 'movement');
				$.unregisterChatSubcommand(baseCommand, 'sleep');
				$.unregisterChatSubcommand(baseCommand, 'wellbeing');
				$.unregisterChatCommand(baseCommand);
				$.unregisterChatCommand(baseCommand + 'settings');
				$.unregisterChatSubcommand(baseCommand + 'settings', 'set');

				// register the new commands
				baseCommand = newCommand;
				$.registerChatCommand('./custom/systems/healthSystem.js', baseCommand, permBase);
				$.registerChatSubcommand(baseCommand, 'toggle', permSetToggle);
				$.registerChatSubcommand(baseCommand, 'hydration', permSetHydration);
				$.registerChatSubcommand(baseCommand, 'hunger', permSetHunger);
				$.registerChatSubcommand(baseCommand, 'movement', permSetMovement);
				$.registerChatSubcommand(baseCommand, 'sleep', permSetSleep);
				$.registerChatSubcommand(baseCommand, 'wellbeing', permSetWellbeing);
				$.registerChatCommand('./custom/systems/healthSystem.js', baseCommand + 'settings', permBaseSettings);
				$.registerChatSubcommand(baseCommand + 'settings', 'set', permBaseSettings);
			} else {
				$.inidb.set('healthSettings', 'baseCommand', baseCommand);
				$.consoleDebug($.lang.get('healthsystem.set.basecommand.failed', newCommand));
			}
		}

		//Hydration Settings
		hydrationoz = $.getIniDbNumber('healthSettings', 'hydrationoz'),
		hydrationtimer = $.getIniDbNumber('healthSettings', 'hydrationtimer'),
		hydrationtoggle = $.getIniDbBoolean('healthSettings', 'hydration');

		//Hunger Settings
		hungertimer = $.getIniDbNumber('healthSettings', 'hungertimer'),
		hungertoggle = $.getIniDbBoolean('healthSettings', 'hunger');

		//Movement Settings
		movementtimer = $.getIniDbNumber('healthSettings', 'movementtimer'),
		movementtoggle = $.getIniDbBoolean('healthSettings', 'movement');

		//Sleep Settings
		sleeptimer = $.getIniDbNumber('healthSettings', 'sleeptimer'),
		sleeptoggle = $.getIniDbBoolean('healthSettings', 'sleep');

		//Wellbeing Settings
		wellbeingtimer = $.getIniDbNumber('healthSettings', 'wellbeingtimer'),
		wellbeingtoggle = $.getIniDbBoolean('healthSettings', 'wellbeing');
	}

	/**
     * @function hydrationReminder
     */
	function hydrationReminder(cmd, timer, sender){
		var uptime = $.getStreamUptime($.channelName);

		//get oz count
		var hydrationcountoz = (getUptimeMinutes() * (hydrationoz / 60)).toFixed(1),
			hydrationcountml = (hydrationcountoz / 0.0351951).toFixed(2);

		//check whether timer hit or someone used the command
		if(timer && sender === 'reminder') {
			//broadcast response
			if($.isOnline($.channelName)){
				$.say($.lang.get('healthsystem.hydration.reminder', uptime, hydrationcountoz, hydrationcountml));
				return;
			}
		} else {
			if(timer) {
				//broadcast response
				if($.isOnline($.channelName)){
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.hydration.command', $.username.resolve($.channelName), uptime, hydrationcountoz, hydrationcountml));
					return;
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.health.offline', baseCommand, cmd, $.channelName));
					return;
				}
			}
		}
	}

	/**
     * @function hungerReminder
     */
	function hungerReminder(cmd, timer, sender){
		var uptime = $.getStreamUptime($.channelName);

		//get hunger timer
		var hungertime = Math.floor(getUptimeMinutes() / $.getSetIniDbNumber('healthSettings', 'hungertimer')),
			timetoeat = $.getSetIniDbNumber('healthSettings', 'hungertimer') - (getUptimeMinutes() - (hungertime * $.getSetIniDbNumber('healthSettings', 'hungertimer')));

		//check whether timer hit or someone used the command
		if(timer && sender === 'reminder') {
			//broadcast response
			if($.isOnline($.channelName)){
				$.say($.lang.get('healthsystem.hunger.reminder', uptime));
				return;
			}
		} else {
			if(timer) {
				//broadcast response
				if($.isOnline($.channelName)){
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.hunger.command', $.username.resolve($.channelName), uptime, timetoeat));
					return;
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.health.offline', baseCommand, cmd, $.channelName));
					return;
				}
			}
		}
	}

	/**
     * @function movementReminder
     */
	function movementReminder(cmd, timer, sender){
		var uptime = $.getStreamUptime($.channelName);

		//get movement timer
		var movementtime = Math.floor(getUptimeMinutes() / $.getSetIniDbNumber('healthSettings', 'movementtimer')),
			timetomove = $.getSetIniDbNumber('healthSettings', 'movementtimer') - (getUptimeMinutes() - (movementtime * $.getSetIniDbNumber('healthSettings', 'movementtimer')));

		//check whether timer hit or someone used the command
		if(timer && sender === 'reminder') {
			//broadcast response
			if($.isOnline($.channelName)){
				$.say($.lang.get('healthsystem.movement.reminder', uptime));
				return;
			}
		} else {
			if(timer) {
				//broadcast response
				if($.isOnline($.channelName)){
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.movement.command', $.username.resolve($.channelName), uptime, timetomove));
					return;
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.health.offline', baseCommand, cmd, $.channelName));
					return;
				}
			}
		}
	}

	/**
     * @function sleepReminder
     */
	function sleepReminder(cmd, timer, sender){
		var uptime = $.getStreamUptime($.channelName);

		//get movement timer
		var sleeptime = Math.floor(getUptimeMinutes() / $.getSetIniDbNumber('healthSettings', 'sleeptimer')),
			timetomove = $.getSetIniDbNumber('healthSettings', 'sleeptimer') - (getUptimeMinutes() - (sleeptime * $.getSetIniDbNumber('healthSettings', 'sleeptimer')));

		//check whether timer hit or someone used the command
		if(timer && sender === 'reminder') {
			//broadcast response
			if($.isOnline($.channelName)){
				$.say($.lang.get('healthsystem.sleep.reminder', uptime));
				return;
			}
		} else {
			if(timer) {
				//broadcast response
				if($.isOnline($.channelName)){
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.sleep.command', $.username.resolve($.channelName), uptime, timetomove));
					return;
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.health.offline', baseCommand, cmd, $.channelName));
					return;
				}
			}
		}
	}

	/**
     * @function wellbeingReminder
     */
	function wellbeingReminder(cmd, timer, sender){
		var uptime = $.getStreamUptime($.channelName),
			randomNumber;

		//get movement timer
		var wellbeingtime = Math.floor(getUptimeMinutes() / $.getSetIniDbNumber('healthSettings', 'wellbeingtimer')),
			timetomove = $.getSetIniDbNumber('healthSettings', 'wellbeingtimer') - (getUptimeMinutes() - (wellbeingtime * $.getSetIniDbNumber('healthSettings', 'wellbeingtimer')));

		//check whether timer hit or someone used the command
		if(timer && sender === 'reminder') {
			//broadcast response
			if($.isOnline($.channelName)){
				randomNumber = $.randRange(1, wellbeingCountReminder - 1);
				$.say($.lang.get('healthsystem.wellbeing.reminder.' + randomNumber, uptime));
				return;
			}
		} else {
			if(timer) {
				//broadcast response
				if($.isOnline($.channelName)){
					randomNumber = $.randRange(1, wellbeingCountCommand - 1);
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.wellbeing.command.' + randomNumber, $.username.resolve($.channelName), uptime, timetomove));
					return;
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.health.offline', baseCommand, cmd, $.channelName));
				}
			}
		}
	}

	/**
     * @function reminderBot
     */
	function reminderBot(){
		if($.bot.isModuleEnabled('./custom/systems/healthSystem.js')){
			if(hydrationtoggle == true){
				hydrationReminder(null, checkTimer('hydrationtimer'), 'reminder');
			}
			if(hungertoggle == true){
				hungerReminder(null, checkTimer('hungertimer'), 'reminder');
			}
			if(movementtoggle == true){
				movementReminder(null, checkTimer('movementtimer'), 'reminder');
			}
			if(sleeptoggle == true){
				sleepReminder(null, checkTimer('sleeptimer'), 'reminder');
			}
			if(wellbeingtoggle == true){
				wellbeingReminder(null, checkTimer('wellbeingtimer'), 'reminder');
			}
		}
	}

	/**
     * @function getUptimeMinutes
     */
	function getUptimeMinutes(){
		var uptimesec = $.getStreamUptimeSeconds($.channelName),
			uptimeminutes = Math.floor(uptimesec / 60);
		return uptimeminutes;
	}

	/**
     * @function checkTimer
     */
	function checkTimer(timer){
		var timerminutes = Math.floor($.getIniDbNumber('healthSettings', timer));
		//prevent activation at start of stream!
		var timerhits = getUptimeMinutes() / timerminutes;
			timercheck = timerhits - Math.floor(timerhits);
			if (getUptimeMinutes() < 5) {
				return false;
			}
			$.consoleDebug('Health system: ' + timer + ' timer check >>> ' + !timercheck) ;
		return !timercheck;
	}

	/*
     * @function pushWellbeinReminder
     * @info Pushes the entire wellbeing reminder list to the db, it does disable auto commit first to make this process a lot faster.
     */
    function pushWellbeinReminder() {
    	var wellbeingReminderID,
    		wellbeingReminderResponce = [];

        $.inidb.setAutoCommit(false);
        for (wellbeingReminderID = 1; $.lang.exists('healthsystem.wellbeing.reminder.' + wellbeingReminderID); wellbeingReminderID++) {
            wellbeingReminderResponce.push($.lang.get('healthsystem.wellbeing.reminder.' + wellbeingReminderID));            
        }
        wellbeingCountReminder = wellbeingReminderID;

        $.consoleDebug($.lang.get('healthsystem.wellbeing.reminder.loaded', wellbeingCountReminder - 1));
        $.inidb.setAutoCommit(true);
    }

    /*
     * @function pushWellbeinCommand
     * @info Pushes the entire wellbeing command list to the db, it does disable auto commit first to make this process a lot faster.
     */
    function pushWellbeinCommand() {
    	var wellbeingCommandID,
    		wellbeingCommandResponce = [];

        $.inidb.setAutoCommit(false);
        for (wellbeingCommandID = 1; $.lang.exists('healthsystem.wellbeing.command.' + wellbeingCommandID); wellbeingCommandID++) {
            wellbeingCommandResponce.push($.lang.get('healthsystem.wellbeing.command.' + wellbeingCommandID));
        }
        wellbeingCountCommand = wellbeingCommandID;

        $.consoleDebug($.lang.get('healthsystem.wellbeing.command.loaded', wellbeingCountCommand - 1));
        $.inidb.setAutoCommit(true);
    }

    /*
     * @function pushWellbein
     * @info Pushes the entire wellbeing list to the db.
     */
    function pushWellbein() {
    	pushWellbeinReminder();
    	pushWellbeinCommand();
    }

    /**
     * @event command
     */
    $.bind('command',function(event){
	    var command = event.getCommand(),
            sender = event.getSender(),
			args = event.getArgs(),
            action = args[0];
			optionChoice = args[1];
			optionValue = args[2];
			optionValue2 = args[3];

		if (command.equalsIgnoreCase(baseCommand)) {
			if (action === undefined) {
				$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.health.usage', baseCommand));
				return;
			}

			/**
             * @commandpath "baseCommand" toggle - Base command for controlling the health toggles
             */
			if (action.equalsIgnoreCase('toggle')) {
				if (optionChoice === undefined) {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.toggle.usage', baseCommand));
					return;
				} else {
                    var healthToggles = $.getIniDbBoolean('healthSettings', optionChoice);
                    if (healthToggles == null) {
                        $.say($.whisperPrefix(sender) + $.lang.get('healthsystem.toggle.setting.fail', optionChoice));
                    } else {
                        healthToggles = !healthToggles;
                        $.inidb.set('healthSettings', optionChoice, healthToggles);
                        $.say($.whisperPrefix(sender) + $.lang.get('healthsystem.toggle.setting.pass', optionChoice, (healthToggles === true ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
                        reloadHealth();
                    }
                }
			}

			/**
             * @commandpath "baseCommand" hydration - Base command for hydration
             */
			if (action.equalsIgnoreCase('hydration')) {
				if (optionChoice === undefined) {
					hydrationReminder('hydration', true, sender);
					return;
				}
			}

			/**
             * @commandpath "baseCommand" hunger - Base command for hunger
             */
			if (action.equalsIgnoreCase('hunger')) {
				if (optionChoice === undefined) {
					hungerReminder('hunger', true, sender);
					return;
				}
			}

			/**
             * @commandpath "baseCommand" movement - Base command for movement
             */
			if (action.equalsIgnoreCase('movement')) {
				if (optionChoice === undefined) {
					movementReminder('movement', true, sender);
					return;
				}
			}

			/**
             * @commandpath "baseCommand" sleep - Base command for sleep
             */
			if (action.equalsIgnoreCase('sleep')) {
				if (optionChoice === undefined) {
					sleepReminder('sleep', true, sender);
					return;
				}
			}

			/**
             * @commandpath "baseCommand" wellbeing - Base command for sleep
             */
			if (action.equalsIgnoreCase('wellbeing')) {
				if (optionChoice === undefined) {
					wellbeingReminder('wellbeing', true, sender);
					return;
				}
			}

		}

		if (command.equalsIgnoreCase(baseCommand + 'settings')) {
			if (action === undefined) {
				$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage', baseCommand + 'settings'));
				return;
			}

			/**
             * @commandpath "baseCommandSettings" set - Base command for controlling the settings!
             */
			if (action.equalsIgnoreCase('set')) {
				if (optionChoice === undefined) {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set', baseCommand + 'settings'));
					return;	
				}
				if (optionChoice.equalsIgnoreCase('hydration')) {
					if ($.inidb.exists('healthSettings', optionChoice + '' +optionValue)) {
						if ((optionValue2 === undefined) || isNaN(optionValue2) || (optionValue2 < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.hydration', baseCommand + 'settings'));
							return;	
						} else {
							if (optionValue.equalsIgnoreCase('oz')) {
								$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.set.hydration', baseCommand + 'settings', optionChoice, optionValue, optionValue2));
								hydrationoz = $.setIniDbBoolean('healthSettings', 'hydrationoz', optionValue2);
							} 
							if (optionValue.equalsIgnoreCase('timer')) {
								$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.set.hydration', baseCommand + 'settings', optionChoice, optionValue, optionValue2));
								hydrationtimer = $.setIniDbBoolean('healthSettings', 'hydrationtimer', optionValue2);
							}
							reloadHealth();
							return;						
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.hydration', baseCommand + 'settings'));
						return;	
					}
				} else if (optionChoice.equalsIgnoreCase('hunger')) {
					if ($.inidb.exists('healthSettings', optionChoice + '' +optionValue)) {
						if ((optionValue2 === undefined) || isNaN(optionValue2) || (optionValue2 < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.hunger', baseCommand + 'settings'));
							return;	
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.set.hunger', baseCommand + 'settings', optionChoice, optionValue, optionValue2));
							hungertimer = $.setIniDbBoolean('healthSettings', 'hungertimer', optionValue);
							reloadHealth();
							return;						
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.hunger', baseCommand + 'settings'));
						return;	
					}
				} else if (optionChoice.equalsIgnoreCase('movement')) {
					if ($.inidb.exists('healthSettings', optionChoice + '' +optionValue)) {
						if ((optionValue2 === undefined) || isNaN(optionValue2) || (optionValue2 < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.movement', baseCommand + 'settings'));
							return;	
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.set.movement', baseCommand + 'settings', optionChoice, optionValue, optionValue2));
							movementtimer = $.setIniDbBoolean('healthSettings', 'movementtimer', optionValue);
							reloadHealth();
							return;						
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.movement', baseCommand + 'settings'));
						return;	
					}
				} else if (optionChoice.equalsIgnoreCase('sleep')) {
					if ($.inidb.exists('healthSettings', optionChoice + '' +optionValue)) {
						if ((optionValue2 === undefined) || isNaN(optionValue2) || (optionValue2 < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.sleep', baseCommand + 'settings'));
							return;	
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.set.sleep', baseCommand + 'settings', optionChoice, optionValue, optionValue2));
							sleeptimer = $.setIniDbBoolean('healthSettings', 'sleeptimer', optionValue);
							reloadHealth();
							return;						
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.sleep', baseCommand + 'settings'));
						return;
					}
				} else if (optionChoice.equalsIgnoreCase('wellbeing')) {
					if ($.inidb.exists('healthSettings', optionChoice + '' +optionValue)) {
						if ((optionValue2 === undefined) || isNaN(optionValue2) || (optionValue2 < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.wellbeing', baseCommand + 'settings'));
							return;	
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.set.wellbeing', baseCommand + 'settings', optionChoice, optionValue, optionValue2));
							wellbeingtimer = $.setIniDbBoolean('healthSettings', 'wellbeingtimer', optionValue);
							reloadHealth();
							return;					
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set.wellbeing', baseCommand + 'settings'));
						return;	
					}
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.usage.set', baseCommand + 'settings'));
					return;	
				}
			}

			/**
             * @commandpath "baseCommandSettings" check - Base command for check the settings!
             */
			if (action.equalsIgnoreCase('check')) {
				if (optionChoice) {
					if (optionChoice.equalsIgnoreCase('hydration')) {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.check.hydration', optionChoice, hydrationoz, hydrationtimer, hydrationtoggle));
						return;
					} else if (optionChoice.equalsIgnoreCase('hunger')) {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.check.hunger', optionChoice, hungertimer, hungertoggle));
						return;
					} else if (optionChoice.equalsIgnoreCase('movement')) {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.check.movement', optionChoice, movementtimer, movementtoggle));
						return;
					} else if (optionChoice.equalsIgnoreCase('sleep')) {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.check.sleep', optionChoice, sleeptimer, sleeptoggle));
						return;
					} else if (optionChoice.equalsIgnoreCase('wellbeing')) {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.check.wellbeing', optionChoice, wellbeingtimer, wellbeingtoggle));
						return;
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.check.usage', baseCommand + 'settings'));
						return;
					}
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('healthsystem.settings.check.usage', baseCommand + 'settings'));
					return;
				}
				
			}
		}

		if (command.equalsIgnoreCase('reloadhealth')) {
	        reloadHealth();
	    }
    });

	//Register command.
	$.bind('initReady',function(){
	    if($.bot.isModuleEnabled('./custom/systems/healthSystem.js')){
	    	pushWellbein();

			$.registerChatCommand('./custom/systems/healthSystem.js',baseCommand,7);
			$.registerChatSubcommand(baseCommand, 'hydration', 7);
			$.registerChatSubcommand(baseCommand, 'hunger', 7);
			$.registerChatSubcommand(baseCommand, 'movement', 7);
			$.registerChatSubcommand(baseCommand, 'sleep', 7);
			$.registerChatSubcommand(baseCommand, 'wellbeing', 7);
			$.registerChatSubcommand(baseCommand, 'toggle', 1);

			$.registerChatCommand('./custom/systems/healthSystem.js',baseCommand + 'settings',2);
			$.registerChatSubcommand(baseCommand + 'settings', 'check', 2);
			$.registerChatSubcommand(baseCommand + 'settings', 'set', 1);

			$.registerChatCommand('./custom/systems/healthSystem.js', 'reloadhealth', 30);
	    }    
	});
	
	setTimeout(function() {
		setInterval(function() { reminderBot(); }, 6e4, 'scripts::custom::systems::healthSystem.js');
	}, 5e3);

	$.reloadHealth = reloadHealth;
})();