/**
 * challengeSystem.js
 *
 * A command that will let you challenge another user to a fight.
 *
 * Current version 2.1.0
 * 
 * Original author: yxpoh (https://community.phantombot.tv/t/the-challenge-automated-randomized-fighting-chat-game/1529)
 * 
 * Contributors:
 * UsernamesSuck, TheRealAlixe, ArthurTheLastAncient
 *
 */
(function() {
	var // General variables
		currentChallenge = 1,
		attackMoves = 0,
		dodgeMoves = 0,
		acceptTimeout,
		baseCommand = $.getSetIniDbString('challengeSettings', 'baseCommand', 'challenge'),
		attackSuccess = $.getSetIniDbNumber('challengeSettings', 'attackSuccess', 65),
		minDmg = $.getSetIniDbNumber('challengeSettings', 'minDmg', 1),
		maxDmg = $.getSetIniDbNumber('challengeSettings', 'maxDmg', 5),
		defaultHealth = $.getSetIniDbNumber('challengeSettings', 'defaultHealth', 10),
		timeoutSec = $.getSetIniDbNumber('challengeSettings', 'timeoutSec', 60),
		messageInterval = $.getSetIniDbNumber('challengeSettings', 'messageInterval', 5),
		challengeInterval = $.getSetIniDbNumber('challengeSettings', 'challengeInterval', 5),
		wager = $.getSetIniDbNumber('challengeSettings', 'wager', 0),
		tempwager = $.getSetIniDbNumber('challengeSettings', 'tempwager', 0),
		minwager = $.getSetIniDbNumber('challengeSettings', 'minwager', 0),
		maxwager = $.getSetIniDbNumber('challengeSettings', 'maxwager', 0),
		captions = $.getSetIniDbNumber('challengeSettings', 'captions', 4),
		recovery = $.getSetIniDbNumber('challengeSettings', 'recovery', 10);
	
    /**
     * @function reloadChallenge
     */
	function reloadChallenge() {
		var newCommand = $.getSetIniDbString('challengeSettings', 'baseCommand', 'challenge');
		newCommand = newCommand.toLowerCase();
		if (newCommand != baseCommand) {
			if (!commandExists(newCommand)) {
				var permBase = $.inidb.get('permcom', baseCommand);
				var permSet = $.inidb.get('permcom', baseCommand + ' set');
				var permReset = $.inidb.get('permcom', baseCommand + ' reset');
				$.unregisterChatSubcommand(baseCommand, 'set');
				$.unregisterChatSubcommand(baseCommand, 'reset');
				$.unregisterChatCommand(baseCommand);
				baseCommand = newCommand;
				$.registerChatCommand('./custom/games/challengeSystem.js', baseCommand, permBase);
				$.registerChatSubcommand(baseCommand, 'set', permSet);
				$.registerChatSubcommand(baseCommand, 'reset', permReset);
			} else {
				$.inidb.set('challengeSettings', 'baseCommand', baseCommand);
				$.consoleDebug($.lang.get('challengesystem.set.basecommand.failed', optionValue));
			}
		}
        attackSuccess = $.getIniDbNumber('challengeSettings', 'attackSuccess');
        minDmg = $.getIniDbNumber('challengeSettings', 'minDmg');
        maxDmg = $.getIniDbNumber('challengeSettings', 'maxDmg');
        defaultHealth = $.getIniDbNumber('challengeSettings', 'defaultHealth');
        timeoutSec = $.getIniDbNumber('challengeSettings', 'timeoutSec');
		messageInterval = $.getIniDbNumber('challengeSettings', 'messageInterval');
		challengeInterval = $.getIniDbNumber('challengeSettings', 'challengeInterval');
        captions = $.getIniDbNumber('challengeSettings', 'captions');
		recovery = $.getIniDbNumber('challengeSettings', 'recovery');
		wager = $.getIniDbNumber('challengeSettings', 'wager');
		tempwager = $.getIniDbNumber('challengeSettings', 'tempwager');
		minwager = $.getIniDbNumber('challengeSettings', 'minwager');
		maxwager = $.getIniDbNumber('challengeSettings', 'maxwager');
    }

    /**
     * @function initialiseChallengeSystem
     */
	function initialiseChallengeSystem() {
		clearCurrentChallenge();
		loadAttacks();
		loadDodges();
    }

    /**
     * @function clearCurrentChallenge
     */
	function clearCurrentChallenge() {
		currentChallenge = {
			challenger: undefined,
			challenged: undefined,
			challengerHealth: undefined,
			challengedHealth: undefined,
			currentTurn: undefined,
			lastMove: undefined,
			showCaptions: true,
			inProgress: false,
		};
	}

    /**
     * @function loadAttacks
     */	
	function loadAttacks() {
        var i;
		attackMoves = 0;
		// Use the data from lang files to calculate the amount of attack options
        for (i = 1; $.lang.exists('challengesystem.attack.' + i); i++) {
            attackMoves++;
        }
        $.consoleDebug($.lang.get('challengesystem.console.attacksloaded', attackMoves));
    }

    /**
     * @function loadDodges
     */
	function loadDodges() {
        var i;
		dodgeMoves = 0;
		// Use the data from lang files to calculate the amount of dodoge options
        for (i = 1; $.lang.exists('challengesystem.dodge.' + i); i++) {
            dodgeMoves++;
        }
        $.consoleDebug($.lang.get('challengesystem.console.dodgesloaded', dodgeMoves));
    }

    /**
     * @function clearExpired
     */
	 function clearExpired() {
		// This will clear the settings if a fight is not in progress and the reply timeout expires
		$.say($.lang.get('challengesystem.challenge.noreply', baseCommand, currentChallenge.challenger, currentChallenge.challenged));
		if ((tempwager > 0) && $.bot.isModuleEnabled('./systems/pointSystem.js')) {
			$.inidb.incr('points', currentChallenge.challenger.toLowerCase(), tempwager);
		}
		clearCurrentChallenge();
    }

    /**
     * @function clearRefused
     */
	 function clearRefused() {
		// This will clear the settings if a fight is not in progress and the challenge user declines
		$.say($.lang.get('challengesystem.challenge.refused', baseCommand, currentChallenge.challenger, currentChallenge.challenged));
		if ((tempwager > 0) && $.bot.isModuleEnabled('./systems/pointSystem.js')) {
			$.inidb.incr('points', currentChallenge.challenger.toLowerCase(), tempwager);
		}
		clearCurrentChallenge();
    }

    /**
     * @function challengeSequence
	 * @param {string} attacker
	 * @param {string} defender
	 * @param {Number} defHealth
	 * @param {Number} turn
	 * @returns {Number}
     */
	function challengeSequence(attacker, defender, defHealth, turn) {
		var i = $.randRange(0, 100); // Randomizing attack success or failure
		var move = 0; // Initialize move
		var damage = 0; // Initialise damage
		var chatOutput = ''; // Initialise chat output

		if (i <= attackSuccess) { // was attack successful?
			// Attack
			// Randomize Attack Damage
			do {
				damage = $.randRange(minDmg, maxDmg);
			} while (damage > maxDmg && damage < minDmg);

			// Reduce health accordingly.
			defHealth -= damage;

			// Randomize Attack Description
			do {
				move = $.randRange(1, attackMoves);
			} while (((move > attackMoves && move < 1) || move == currentChallenge.lastMove) && attackMoves > 1);
			chatOutput = $.lang.get('challengesystem.attack.' + move, attacker, defender, damage);
		} else {
			// Dodge
			// Randomize Dodge Description
			do {
				move = $.randRange(1, dodgeMoves);
			} while (((move > dodgeMoves && move < 1) || move == currentChallenge.lastMove) && dodgeMoves > 1);
			chatOutput = $.lang.get('challengesystem.dodge.' + move, attacker, defender);
		}
		
		// Remember the last used move so the next move will be different
		currentChallenge.lastMove = move;

		// Output description to chat if appropriate
		if (turn <= captions) {
			// Display Battle text
			$.say(chatOutput);
		} else {
			// Display max captions message to chat only once
			if (currentChallenge.showCaptions) {
				currentChallenge.showCaptions = false;
				$.say($.lang.get('challengesystem.challenge.maxcaptionsreached'));				
			}
		}

		// Return resulting health
		return defHealth;
	}

    /**
     * @function initialiseChallenge
     */
	function initialiseChallenge() {
		currentChallenge.challengerHealth = defaultHealth;
		currentChallenge.challengedHealth = defaultHealth;
		currentChallenge.showCaptions = true;
		currentChallenge.currentTurn = 1;
		currentChallenge.lastMove = 0;
        var t = setTimeout(function() {
            runChallenge();
        }, messageInterval * 1e3);
	}

    /**
     * @function cleanupChallenge
     */
	function cleanupChallenge() {
		clearCurrentChallenge();
		$.say($.lang.get('challengesystem.challenge.cleanup', baseCommand));
	}

    /**
     * @function endChallenge
     */
	function endChallenge() {
		var winner = '';

		// End the fight and declare a winner
		if (currentChallenge.challengerHealth <= 0) {
			// Challenger has lost. Challenged is the winner!
			winner = currentChallenge.challenged;
		} else {
			// Challenged has lost. Challenger is the winner!
			winner = currentChallenge.challenger;
		}

		// Output the result to the chat
		if ((tempwager > 0) && $.bot.isModuleEnabled('./systems/pointSystem.js')) {
			// We have a bet, so use the appropriate language sentence and add the currency to the winner's account
			$.say($.lang.get('challengesystem.challenge.endwager', baseCommand, winner, $.getPointsString(tempwager * 2)));
			$.inidb.incr('points', winner.toLowerCase(), tempwager * 2);
		} else {
			// We don't have a bet, so use the appropriate language sentence
			$.say($.lang.get('challengesystem.challenge.endnowager', baseCommand, winner));
		}

		// Save Challenger and Challenged times to Database for Recovery time option
		$.inidb.set('challengeTimes', currentChallenge.challenger, Date.now());
		$.inidb.set('challengeTimes', currentChallenge.challenged, Date.now());

		// Prepare the cleanup and free the Arena
		var t = setTimeout(function() {
			cleanupChallenge();
		}, challengeInterval * 1e3);

	}

    /**
     * @function runChallenge
     */
	function runChallenge() {
		// If Challenge was cleared using "reset" option, we need to silently exit
		if (!currentChallenge.inProgress) {
			return;
		}

		// Using modulus to switch turn between both parties. Challenger will start first.
		if (currentChallenge.currentTurn % 2 == 1) {
			// Launch challengeSequence with Challenger as attacker.
			currentChallenge.challengedHealth = challengeSequence(
				currentChallenge.challenger,
				currentChallenge.challenged,
				currentChallenge.challengedHealth,
				currentChallenge.currentTurn
			);
		} else {
			// Launch challengeSequence with Challenged as attacker.
			currentChallenge.challengerHealth = challengeSequence(
				currentChallenge.challenged,
				currentChallenge.challenger,
				currentChallenge.challengerHealth,
				currentChallenge.currentTurn
			);
		}

		// Check if we have a winner
		if ((currentChallenge.challengerHealth <= 0) || (currentChallenge.challengedHealth <= 0)) {
			// Someone's health has been reduced to 0, so we have a winner!
			var t = setTimeout(function() {
				endChallenge();
			}, messageInterval * 1e3);
			
		} else {
			// No winner yet, so let's schedule the next round
			currentChallenge.currentTurn++;
			if (currentChallenge.showCaptions) {
				// Set delay to set messageInterval
				var t = setTimeout(function() {
					runChallenge();
				}, messageInterval * 1e3);
			} else {
				// We're not showing captions (anymore), so the delay can be small
				var t = setTimeout(function() {
					runChallenge();
				}, 100);
			}
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

        /**
         * @commandpath "baseCommand" - Challenge command for starting, checking or setting options
         * @commandpath "baseCommand" [user] - issue/accept a challenge
         * @commandpath "baseCommand" accept - accept an incoming challenge
         */
		if (command.equalsIgnoreCase(baseCommand)) {

			if (action === undefined)
			{
				$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage', baseCommand));
				return;
			}

            /**
             * @commandpath "baseCommand" set - Base command for controlling the challenge settings
             */
			if (action.trim().equalsIgnoreCase('set')) {
				if (optionChoice === undefined) {
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.usage', baseCommand));
					return;
				}
				
				/**
				 * @commandpath "baseCommand" set minDamage [integer] - Used to set the minimum amount of damage done with a successful attack
				 */
				if (optionChoice.trim().equalsIgnoreCase('minDamage')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.mindamage.usage', baseCommand, minDmg));
						return;
					} else {
						minDmg = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'minDmg', parseInt(optionValue));
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.mindamage.success', baseCommand, minDmg));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set maxDamage [integer] - Used to set the maximum amount of damage done with a successful attack
				 */
				if (optionChoice.trim().equalsIgnoreCase('maxDamage')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.maxdamage.usage', baseCommand, maxDmg));
						return;
					} else {
						maxDmg = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'maxDmg', parseInt(optionValue));
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.maxdamage.success', baseCommand, maxDmg));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set health [integer] - Used to set the starting amount of health each player has
				 */
				if (optionChoice.trim().equalsIgnoreCase('health')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.health.usage', baseCommand, defaultHealth));
						return;
					} else {
						defaultHealth = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'defaultHealth', defaultHealth);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.health.success', baseCommand, defaultHealth));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set attackrate [integer] - Used to set the successrate of attacks
				 */
				if (optionChoice.trim().equalsIgnoreCase('attackRate')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.attackrate.usage', baseCommand, attackSuccess));
						return;
					} else {
						attackSuccess = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'attackSuccess', attackSuccess);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.attackrate.success', baseCommand, attackSuccess));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set wager [integer] - Used to set the amount of currency wagered on the challenge. Set to 0 to disable.
				 */
				if (optionChoice.trim().equalsIgnoreCase('wager')){
					if ($.bot.isModuleEnabled('./systems/pointSystem.js')) {
						if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.wager.usage', baseCommand, $.getPointsString(wager)));
							return;
						} else {
							wager = parseInt(optionValue);
							$.inidb.set('challengeSettings', 'wager', wager);
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.wager.success', baseCommand, $.getPointsString(wager)));
							return;
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.wager.pointsystem', './systems/pointSystem.js'));
					}
				}

				/**
				 * @commandpath "baseCommand" set minwager [integer] - Used to set the minimum amount of currency wagered on the challenge. Set to 0 to disable.
				 */
				if (optionChoice.trim().equalsIgnoreCase('minwager')){
					if ($.bot.isModuleEnabled('./systems/pointSystem.js')) {
						if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.minwager.usage', baseCommand, $.getPointsString(minwager)));
							return;
						} else {
							minwager = parseInt(optionValue);
							$.inidb.set('challengeSettings', 'minwager', minwager);
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.minwager.success', baseCommand, $.getPointsString(minwager)));
							return;
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.minwager.pointsystem', './systems/pointSystem.js'));
					}
				}

				/**
				 * @commandpath "baseCommand" set minwager [integer] - Used to set the minimum amount of currency wagered on the challenge. Set to 0 to disable.
				 */
				if (optionChoice.trim().equalsIgnoreCase('maxwager')){
					if ($.bot.isModuleEnabled('./systems/pointSystem.js')) {
						if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.maxwager.usage', baseCommand, $.getPointsString(maxwager)));
							return;
						} else {
							maxwager = parseInt(optionValue);
							$.inidb.set('challengeSettings', 'maxwager', maxwager);
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.maxwager.success', baseCommand, $.getPointsString(maxwager)));
							return;
						}
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.maxwager.pointsystem', './systems/pointSystem.js'));
					}
				}

				/**
				 * @commandpath "baseCommand" set timeout [integer] - Used to set the time in seconds to accept a challenge.
				 */
				if (optionChoice.trim().equalsIgnoreCase('timeout')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.timeout.usage', baseCommand, timeoutSec));
						return;
					} else {
						timeoutSec = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'timeoutSec', timeoutSec);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.timeout.success', baseCommand, timeoutSec));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set messageInterval [integer] - Used to set the chat message interval in seconds.
				 */
				if (optionChoice.trim().equalsIgnoreCase('messageinterval')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.messageinterval.usage', baseCommand, messageInterval));
						return;
					} else {
						messageInterval = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'messageInterval', messageInterval);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.messageinterval.success', baseCommand, messageInterval));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set challengeInterval [integer] - Used to set the challenge interval in seconds.
				 */
				if (optionChoice.trim().equalsIgnoreCase('challengeinterval')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.challengeinterval.usage', baseCommand, challengeInterval));
						return;
					} else {
						challengeInterval = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'challengeinterval', challengeinterval);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.challengeinterval.success', baseCommand, challengeInterval));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set recovery [integer] - Used to set the user recovery time in minutes.
				 */
				if (optionChoice.trim().equalsIgnoreCase('recovery')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.recovery.usage', baseCommand, recovery));
						return;
					} else {
						recovery = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'recovery', recovery);
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.recovery.success', baseCommand, recovery));
						return;
					}
				}

				/**
				 * @commandpath "baseCommand" set captions [integer] - Used to set the maximum number of chat messages shown per challenge.
				 */
				if (optionChoice.trim().equalsIgnoreCase('captions')){
					if ((optionValue === undefined) || isNaN(optionValue) || (optionValue < 0)) {
						if (captions > 0) {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.usage', baseCommand, captions + ' messages'));
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.usage', baseCommand, 'results only'));
						}
						return;
					} else {
						captions = parseInt(optionValue);
						$.inidb.set('challengeSettings', 'captions', captions);
						if (captions > 0) {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.success', baseCommand, captions + ' messages'));
						} else {
							$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.captions.success', baseCommand, 'results only'));
						}
						return;
					}
				} 

				/**
				 * @commandpath "baseCommand" set baseCommand [string] - Used to set the base command for the challenge system.
				 */
				if (optionChoice.trim().equalsIgnoreCase('basecommand')){
					if (optionValue === undefined) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.basecommand.usage', baseCommand));
						return;
					} else {
						optionValue = $.replace(optionValue,'!','');
						optionValue = optionValue.toLowerCase();
						if (optionValue != baseCommand) {
							if (!commandExists(optionValue)) {
								var permBase = $.inidb.get('permcom', baseCommand);
								var permSet = $.inidb.get('permcom', baseCommand + ' set');
								var permReset = $.inidb.get('permcom', baseCommand + ' reset');
								$.unregisterChatSubcommand(baseCommand, 'set');
								$.unregisterChatSubcommand(baseCommand, 'reset');
								$.unregisterChatCommand(baseCommand);
								baseCommand = optionValue;
								$.inidb.set('challengeSettings', 'baseCommand', baseCommand);
								$.registerChatCommand('./custom/games/challengeSystem.js', baseCommand, permBase);
								$.registerChatSubcommand(baseCommand, 'set', permSet);
								$.registerChatSubcommand(baseCommand, 'reset', permReset);
								$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.basecommand.success', baseCommand));
							} else {
								$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.basecommand.failed', optionValue));
							}
						}
						return;
					}
				}
				/**
				 * @commandpath "baseCommand" set [undefined option] - Show usage.
				 */
				$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.set.usage', baseCommand));
				return;
			} 

            /**
             * @commandpath "baseCommand" reset - Base command for resetting and reloading the challenge module.
             */
			if (action.trim().equalsIgnoreCase('reset')) {
				initialiseChallengeSystem();
				reloadChallenge();
				if ((attackMoves == 0) || (dodgeMoves == 0)) {
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.console.attackdodgeerror', attackMoves, dodgeMoves));
				} else {
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.reset.success', attackMoves, dodgeMoves));
				}
				return;
			}

			//Check if there is a current challenge proposal on-going
			if (!currentChallenge.inProgress){
				// If nothing, then check recovery and wager/balance
				currentChallenge.challenger = $.username.resolve(String($.replace(sender,'@','')));
				currentChallenge.challenged = $.username.resolve(String($.replace(action.trim(),'@','')));
				// See if there's a wager sent with the challenge
				if ((optionChoice === undefined) || isNaN(optionChoice) || (optionChoice < 0)) {
					tempwager = wager;
				} else {
					tempwager = parseInt(optionChoice);
				}
				$.inidb.set('challengeSettings', 'tempwager', tempwager);
				// Check to see if someone wants to beat their own butt
				if (currentChallenge.challenger == currentChallenge.challenged) {
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.noself', baseCommand));
					return;
				}
				var challengerTime = $.getSetIniDbNumber('challengeTimes', currentChallenge.challenger, 0);
				var challengerMinutes = (challengerTime + (recovery * 6e4) - Date.now()) / 6e4;
				var challengedTime = $.getSetIniDbNumber('challengeTimes', currentChallenge.challenged, 0);
				var challengedMinutes = (challengedTime + (recovery * 6e4) - Date.now()) / 6e4;
				if (challengerMinutes >= 0) {
					// Challenger is still recovering
					if (parseInt(challengerMinutes) > 1) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.recovery.challenger.minutes', baseCommand, parseInt(challengerMinutes)));
					} else if (parseInt(challengerMinutes) == 1) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.recovery.challenger.minute', baseCommand, parseInt(challengerMinutes)));
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.recovery.challenger.seconds', baseCommand, parseInt(challengerMinutes * 60)));
					}
				} else if (challengedMinutes >= 0) {
					// Challenged is still recovering
					if (parseInt(challengedMinutes) > 1) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.recovery.challenged.minutes', baseCommand, currentChallenge.challenged, parseInt(challengedMinutes)));
					} else if (parseInt(challengedMinutes) == 1) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.recovery.challenged.minute', baseCommand, currentChallenge.challenged, parseInt(challengedMinutes)));
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.recovery.challenged.seconds', baseCommand, currentChallenge.challenged, parseInt(challengedMinutes * 60)));
					}
				} else if (!$.inidb.exists('points', currentChallenge.challenged.toLowerCase()) && currentChallenge.challenged.toLowerCase() != $.botName.toLowerCase()) {
					// Challenged doesn't seem to exist
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.nochallenged', baseCommand, currentChallenge.challenged));
				} else if ((tempwager < minwager) && (minwager > 0) && (wager > 0) && ($.bot.isModuleEnabled('./systems/pointSystem.js'))) {
					// Trying to issue a challenge below minimum wager
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.minwager', baseCommand, $.getPointsString(minwager)));
				} else if ((tempwager > maxwager) && (maxwager > 0) && (wager > 0) && ($.bot.isModuleEnabled('./systems/pointSystem.js'))) {
					// Trying to issue a challenge above maximum wager
					$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.maxwager', $.pointNameMultiple, baseCommand, $.getPointsString(maxwager)));
				} else if (((tempwager > $.getUserPoints(currentChallenge.challenger)) || (tempwager > $.getUserPoints(currentChallenge.challenged))) && (tempwager > 0) && ($.bot.isModuleEnabled('./systems/pointSystem.js'))) {
					// Someone doesn't have enough currency...
					if ($.getUserPoints(currentChallenge.challenged) === undefined) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.nopoints.challenged', baseCommand, currentChallenge.challenged, $.pointNameMultiple));
					} else if (tempwager > $.getUserPoints(currentChallenge.challenger)) {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.nopoints.challenger', baseCommand, $.pointNameMultiple, $.getPointsString(tempwager)));
					} else {
						$.say($.whisperPrefix(sender) + $.lang.get('challengesystem.challenge.usage.nopoints.challenged', baseCommand, currentChallenge.challenged, $.pointNameMultiple));
					}
				} else {
					// Everything's OK! Let's register the challenge.
					currentChallenge.inProgress = true;
					if ((tempwager > 0) && $.bot.isModuleEnabled('./systems/pointSystem.js')) {
						$.inidb.decr('points', currentChallenge.challenger.toLowerCase(), tempwager);
					}
					acceptTimeout = setTimeout(clearExpired, timeoutSec * 1e3); // Set a timeout to expire the challenge if challenged doesn't reply.
					if(currentChallenge.challenged.toLowerCase() == $.botName.toLowerCase()) {
						$.say($.lang.get('challengesystem.challenge.sentself', baseCommand, currentChallenge.challenger, currentChallenge.challenged));
						clearTimeout(acceptTimeout); // Clear Timeout as there is not need for it to expire.
						if ((tempwager > 0) && $.bot.isModuleEnabled('./systems/pointSystem.js')) {
							$.inidb.decr('points', currentChallenge.challenged.toLowerCase(), tempwager);
						}

						setTimeout(function() {
							initialiseChallenge(); // Initialize the Challenge. This will also set up the setTimeout events to run the challenge.
						}, 5e3);
						return;
					} else {
						$.say($.lang.get('challengesystem.challenge.sent', baseCommand, currentChallenge.challenger, currentChallenge.challenged, timeoutSec));
					}
				}
				return;
			} else {
				// Check if Challenged is responding.
				if (($.replace(action.trim(),'@','').equalsIgnoreCase(currentChallenge.challenger) || $.replace(action.trim(),'@','').equalsIgnoreCase('accept')) &&  $.replace(sender,'@','').equalsIgnoreCase(currentChallenge.challenged)) {
					clearTimeout(acceptTimeout); // Clear Timeout as there is not need for it to expire.
					if ((tempwager > 0) && $.bot.isModuleEnabled('./systems/pointSystem.js')) {
						$.inidb.decr('points', currentChallenge.challenged.toLowerCase(), tempwager);
					}
					$.say($.lang.get('challengesystem.challenge.start', baseCommand, currentChallenge.challenger, currentChallenge.challenged));
					initialiseChallenge(); // Initialize the Challenge. This will also set up the setTimeout events to run the challenge.
					return;
				} else if ($.replace(action.trim(),'@','').equalsIgnoreCase('refuse') || $.replace(action.trim(),'@','').equalsIgnoreCase('decline')) {
					// Challenged user declines
					clearTimeout(acceptTimeout); // Clear Timeout as there is not need for it to expire.
					clearRefused();
				} else { 
					// Challenge in Progress if not Challenge reply
					$.say($.lang.get('challengesystem.challenge.inprogress', baseCommand));
					return;
				}
			}
		}
   });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/games/challengeSystem.js')) {
			// Old version variable conversion
			if (isNaN(captions)) {
				if (captions) {
					captions = 4;
				} else {
					captions = 0;
				}
				$.inidb.set('challengeSettings', 'captions', captions);
			}
			if (captions < 0) {
				captions = 0;
				$.inidb.set('challengeSettings', 'captions', captions);
			}

			// Initial variable initialisation
			clearCurrentChallenge();
			loadAttacks();
			loadDodges();

			if ((attackMoves == 0) || (dodgeMoves == 0)) {
				$.consoleDebug($.lang.get('challengesystem.console.attackdodgeerror', attackMoves, dodgeMoves));
			}

			// Register commands
            $.registerChatCommand('./custom/games/challengeSystem.js', baseCommand, 7);
            $.registerChatSubcommand(baseCommand, 'set', 1);
            $.registerChatSubcommand(baseCommand, 'reset', 1);
        }
		/**
		 * Warn the user if the points system is disabled and this is enabled.
		 */
		if ($.bot.isModuleEnabled('./custom/games/challengeSystem.js') && !$.bot.isModuleEnabled('./systems/pointSystem.js')) {
			$.log.warn("./systems/pointSystem.js is not enabled. Wager will be disabled.");
		}
    });

	$.reloadChallenge = reloadChallenge;
})();
