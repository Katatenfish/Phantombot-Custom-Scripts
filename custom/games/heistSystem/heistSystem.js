/*
 * Copyright (C) 2016-2018 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * When a user joins the heist the module will check if
 *
 * the Tamagotchi module is active and attempt to retrieve the user's tamagotchi.
 * If the user owns a tamagotchi and it's feeling good enough it wil join
 * the heist with it's own entry of half of its owner's bet.
 * If the tamagotchi survives it wil then give it's price to it's owner.
 */

(function() {
    var joinTime = $.getSetIniDbNumber('heistSettings', 'joinTime', 60),
        coolDown = $.getSetIniDbNumber('heistSettings', 'coolDown', 900),
        gainPercent = $.getSetIniDbNumber('heistSettings', 'gainPercent', 30),
        minBet = $.getSetIniDbNumber('heistSettings', 'minBet', 10),
        maxBet = $.getSetIniDbNumber('heistSettings', 'maxBet', 1000),
        enterMessage = $.getSetIniDbBoolean('heistSettings', 'enterMessage', false),
        warningMessage = $.getSetIniDbBoolean('heistSettings', 'warningMessage', false),
        coolDownAnnounce = $.getSetIniDbBoolean('heistSettings', 'coolDownAnnounce', false),
        tgFunIncr = 1,
        tgExpIncr = 0.5,
        tgFoodDecr = 0.25,
        currentHeist = {},
        stories = [],
        lastStory;


    function reloadHeist() {
        joinTime = $.getIniDbNumber('heistSettings', 'joinTime');
        coolDown = $.getIniDbNumber('heistSettings', 'coolDown');
        gainPercent = $.getIniDbNumber('heistSettings', 'gainPercent');
        minBet = $.getIniDbNumber('heistSettings', 'minBet');
        maxBet = $.getIniDbNumber('heistSettings', 'maxBet');
        enterMessage = $.getIniDbBoolean('heistSettings', 'enterMessage');
        warningMessage = $.getIniDbBoolean('heistSettings', 'warningMessage');
        coolDownAnnounce = $.getIniDbBoolean('heistSettings', 'coolDownAnnounce');
    }

    /**
     * @function loadStories
     */
    function loadStories() {
        var storyId = 1,
            chapterId,
            lines;

        currentHeist.users = [];
        currentHeist.survivors = [];
        currentHeist.caught = [];
        currentHeist.gameState = 0;

        stories = [];

        for (storyId; $.lang.exists('heistsystem.stories.' + storyId + '.title'); storyId++) {
            lines = [];
            for (chapterId = 1; $.lang.exists('heistsystem.stories.' + storyId + '.chapter.' + chapterId); chapterId++) {
                lines.push($.lang.get('heistsystem.stories.' + storyId + '.chapter.' + chapterId));
            }

            stories.push({
                game: ($.lang.exists('heistsystem.stories.' + storyId + '.game') ? $.lang.get('heistsystem.stories.' + storyId + '.game') : null),
                title: $.lang.get('heistsystem.stories.' + storyId + '.title'),
                difficulty: $.lang.get('heistsystem.stories.' + storyId + '.difficulty'),
                lines: lines,
            });
        }

        $.consoleDebug($.lang.get('heistsystem.loaded', storyId - 1));

        for (var i in stories) {
            if (stories[i].game === null) {
                return;
            }
        }

        $.log.warn('You must have at least one heist that doesn\'t require a game to be set.');
        currentHeist.gameState = 2;
    }

    /**
     * @function top5
     */
    function top5() {
        var payoutsKeys = $.inidb.GetKeyList('heistPayouts', ''),
            temp = [],
            counter = 1,
            top5 = [],
            i;

        if (payoutsKeys.length == 0) {
            $.say($.lang.get('heistsystem.top5.empty'));
        }

        for (i in payoutsKeys) {
            if (payoutsKeys[i].equalsIgnoreCase($.ownerName) || payoutsKeys[i].equalsIgnoreCase($.botName)) {
                continue;
            }
            temp.push({
                username: payoutsKeys[i],
                amount: parseInt($.inidb.get('heistPayouts', payoutsKeys[i])),
            });
        }

        temp.sort(function(a, b) {
            return (a.amount < b.amount ? 1 : -1);
        });

        for (i in temp) {
            if (counter <= 5) {
                top5.push(counter + '. ' + temp[i].username + ': ' + $.getPointsString(temp[i].amount));
                counter++;
            }
        }
        $.say($.lang.get('heistsystem.top5', top5.join(', ')));
    }

    /**
     * @function checkUserAlreadyJoined
     * @param {string} username
     * @returns {boolean}
     */
    function checkUserAlreadyJoined(username) {
        var i;
        for (i in currentHeist.users) {
            if (currentHeist.users[i].username == username) {
                return true;
            }
        }
        return false;
    }

    /**
     * @function heistUsersListJoin
     * @param {Array} list
     * @returns {string}
     */
    function heistUsersListJoin(list) {
        var temp = [],
            i;
        for (i in list) {
            temp.push($.username.resolve(list[i].username));
        }
        return temp.join(', ');
    }

    /**
     * @function calculateResult
     */
    function calculateResult(num) {
        var i;
        for (i in currentHeist.users) {
            if ($.randRange(0, 100) > Math.floor(num)) {
                currentHeist.survivors.push(currentHeist.users[i]);
            } else {
                currentHeist.caught.push(currentHeist.users[i]);
            }
        }
    }

    /**
     * @function replaceTags
     * @param {string} line
     * @returns {string}
     */
    function replaceTags(line) {
        if (line.indexOf('(caught)') > -1) {
            if (currentHeist.caught.length > 0) {
                return line.replace('(caught)', heistUsersListJoin(currentHeist.caught));
            } else {
                return '';
            }
        }
        if (line.indexOf('(survivors)') > -1) {
            if (currentHeist.survivors.length > 0) {
                return line.replace('(survivors)', heistUsersListJoin(currentHeist.survivors));
            } else {
                return '';
            }
        }
        return line;
    }

    /**
     * @function inviteTamagotchi
     * @param {string} username
     * @param {Number} bet
     */
    function inviteTamagotchi(username, bet) {
        if ($.bot.isModuleEnabled('./custom/games/tamagotchi.js')) {
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            var userTG = $.tamagotchi.getByOwner(username);
            if (userTG) {
                //noinspection JSUnresolvedFunction
                if (userTG.isHappy()) {
                    //noinspection JSUnresolvedFunction
                    userTG
                        .incrFunLevel(tgFunIncr)
                        .incrExpLevel(tgExpIncr)
                        .decrFoodLevel(tgFoodDecr)
                        .save();
                    $.say($.lang.get('heistsystem.tamagotchijoined', userTG.name));
                    currentHeist.users.push({
                        username: userTG.name,
                        tgOwner: username,
                        bet: (bet / 2),
                    });
                } else {
                    //noinspection JSUnresolvedFunction
                    userTG.sayHeistFunLevel();
                }
            }
        }
    }

    /**
     * @function startHeist
     * @param {string} username
     */
    function startHeist(username) {
        currentHeist.gameState = 1;

        setTimeout(function() {
            runStory();
        }, joinTime * 1e3);

        $.say($.lang.get('heistsystem.start.success', $.username.resolve(username), $.pointNameMultiple));
    }

    /**
     * @function joinHeist
     * @param {string} username
     * @param {Number} bet
     * @returns {boolean}
     */
    function joinHeist(username, bet) {
        if (stories.length < 1) {
            $.log.error('No heists found; cannot start an heist.');
            return;
        }

        if (currentHeist.gameState > 1) {
            if (!warningMessage) return;
            $.say($.whisperPrefix(username) + $.lang.get('heistsystem.join.notpossible'));
            return;
        }

        if (checkUserAlreadyJoined(username)) {
            if (!warningMessage) return;
            $.say($.whisperPrefix(username) + $.lang.get('heistsystem.alreadyjoined'));
            return;
        }

        if (bet > $.getUserPoints(username)) {
            if (!warningMessage) return;
            $.say($.whisperPrefix(username) + $.lang.get('heistsystem.join.needpoints', $.getPointsString(bet), $.getPointsString($.getUserPoints(username))));
            return;
        }

        if (bet < minBet) {
            if (!warningMessage) return;
            $.say($.whisperPrefix(username) + $.lang.get('heistsystem.join.bettoolow', $.getPointsString(bet), $.getPointsString(minBet)));
            return;
        }

        if (bet > maxBet) {
            if (!warningMessage) return;
            $.say($.whisperPrefix(username) + $.lang.get('heistsystem.join.bettoohigh', $.getPointsString(bet), $.getPointsString(maxBet)));
            return;
        }

        if (currentHeist.gameState == 0) {
            startHeist(username);
        } else {
            if (enterMessage) {
                $.say($.whisperPrefix(username) + $.lang.get('heistsystem.join.success', $.getPointsString(bet)));
            }
        }

        currentHeist.users.push({
            username: username,
            bet: parseInt(bet),
        });

        $.inidb.decr('points', username.toLowerCase(), bet);
        inviteTamagotchi(username, bet);
        return true;
    }

    /**
     * @function runStory
     */
    function runStory() {
        var progress = 0,
            temp = [],
            story,
            line,
            t;

        currentHeist.gameState = 2;

        var game = $.getGame($.channelName);

        for (var i in stories) {
            if (stories[i].game != null) {
                if (game.equalsIgnoreCase(stories[i].game)) {
                    //$.consoleLn('gamespec::' + stories[i].title);
                    temp.push({
                        title: stories[i].title,
                        difficulty: stories[i].difficulty,
                        lines: stories[i].lines
                    });
                }
            } else {
                //$.consoleLn('normal::' + stories[i].title);
                temp.push({
                    title: stories[i].title,
                    difficulty: stories[i].difficulty,
                    lines: stories[i].lines
                });
            }
        }

        do {
            story = $.randElement(temp);
        } while (story == lastStory && stories.length != 1);

        calculateResult(story.difficulty);

        $.say($.lang.get('heistsystem.runstory', story.title, currentHeist.users.length));

        t = setInterval(function() {
            if (progress < story.lines.length) {
                line = replaceTags(story.lines[progress]);
                if (line != '') {
                    $.say(line.replace(/\(game\)/g, $.twitchcache.getGameTitle() + ''));
                }
            } else {
                endHeist();
                clearInterval(t);
            }
            progress++;
        }, 7e3);
    }

    /**
     * @function endHeist
     */
    function endHeist() {
        var i, pay, username, maxlength = 0;
        var temp = [];

        for (i in currentHeist.survivors) {
            if (currentHeist.survivors[i].tgOwner) {
                currentHeist.survivors[i].username = currentHeist.survivors[i].tgOwner;
            }
            pay = (currentHeist.survivors[i].bet * (gainPercent / 100));
            $.inidb.incr('heistPayouts', currentHeist.survivors[i].username, pay);
            $.inidb.incr('heistPayoutsTEMP', currentHeist.survivors[i].username, pay);
            $.inidb.incr('points', currentHeist.survivors[i].username.toLowerCase(), currentHeist.survivors[i].bet + pay);
        }

        for (i in currentHeist.survivors) {
            username = currentHeist.survivors[i].username;
            maxlength += username.length();
            temp.push($.username.resolve(username) + ' (+' + $.getPointsString($.inidb.get('heistPayoutsTEMP', currentHeist.survivors[i].username)) + ')');
        }

        if (temp.length == 0) {
            $.say($.lang.get('heistsystem.completed.no.win'));
        } else if (((maxlength + 14) + $.channelName.length) > 512) {
            $.say($.lang.get('heistsystem.completed.win.total', currentHeist.survivors.length, currentHeist.caught.length)); //in case too many people enter.
        } else {
            $.say($.lang.get('heistsystem.completed', temp.join(', ')));
        }

        clearCurrentHeist();
        temp = "";
        $.coolDown.set('heist', false, coolDown, false);
        if (coolDownAnnounce) {
            setTimeout(function() {
                $.say($.lang.get('heistsystem.reset', $.pointNameMultiple));
            }, coolDown*1000);
        }
    }

    /**
     * @function clearCurrentHeist
     */
    function clearCurrentHeist() {
        currentHeist = {
            gameState: 0,
            users: [],
            survivors: [],
            caught: [],
        };
        $.inidb.RemoveFile('heistPayoutsTEMP');
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            actionArg1 = args[1],
            actionArg2 = args[2];

        /**
         * @commandpath heist - Heist command for starting, checking or setting options
         * @commandpath heist [amount] - Start/join an heist
         */
        if (command.equalsIgnoreCase('heist')) {
            if (!action) {
                $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.heist.usage', $.pointNameMultiple));
                return;
            }

            if (!isNaN(parseInt(action))) {
                joinHeist(sender, parseInt(action));
                return;
            }

            /**
             * @commandpath heist top5 - Announce the top 5 heistrs in the chat (most points gained)
             */
            if (action.equalsIgnoreCase('top5')) {
                top5();
            }

            /**
             * @commandpath heist set - Base command for controlling the heist settings
             */
            if (action.equalsIgnoreCase('set')) {
                if (actionArg1 === undefined || actionArg2 === undefined) {
                    $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.set.usage'));
                    return;
                }

                /**
                 * @commandpath heist set jointime [seconds] - Set the join time
                 */
                if (actionArg1.equalsIgnoreCase('joinTime')) {
                    if (isNaN(parseInt(actionArg2))) {
                        $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.set.usage'));
                        return;
                    }
                    joinTime = parseInt(actionArg2);
                    $.inidb.set('heistSettings', 'joinTime', parseInt(actionArg2));
                }

                /**
                 * @commandpath heist set cooldown [seconds] - Set cooldown time
                 */
                if (actionArg1.equalsIgnoreCase('coolDown')) {
                    if (isNaN(parseInt(actionArg2))) {
                        $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.set.usage'));
                        return;
                    }
                    coolDown = parseInt(actionArg2);
                    $.inidb.set('heistSettings', 'coolDown', parseInt(actionArg2));
                }

                /**
                 * @commandpath heist set gainpercent [value] - Set the gain percent value
                 */
                if (actionArg1.equalsIgnoreCase('gainPercent')) {
                    if (isNaN(parseInt(actionArg2))) {
                        $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.set.usage'));
                        return;
                    }
                    gainPercent = parseInt(actionArg2);
                    $.inidb.set('heistSettings', 'gainPercent', parseInt(actionArg2));
                }

                /**
                 * @commandpath heist set minbet [value] - Set the minimum bet
                 */
                if (actionArg1.equalsIgnoreCase('minBet')) {
                    if (isNaN(parseInt(actionArg2))) {
                        $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.set.usage'));
                        return;
                    }
                    minBet = parseInt(actionArg2);
                    $.inidb.set('heistSettings', 'minBet', parseInt(actionArg2));
                }

                /**
                 * @commandpath heist set maxbet [value] - Set the maximum bet
                 */
                if (actionArg1.equalsIgnoreCase('maxBet')) {
                    if (isNaN(parseInt(actionArg2))) {
                        $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.set.usage'));
                        return;
                    }
                    maxBet = parseInt(actionArg2);
                    $.inidb.set('heistSettings', 'maxBet', parseInt(actionArg2));
                }

                /**
                 * @commandpath heist set warningmessages [true / false] - Sets the per-user warning messages
                 */
                if (actionArg1.equalsIgnoreCase('warningmessages')) {
                    if (args[2].equalsIgnoreCase('true')) warningMessage = true, actionArg2 = $.lang.get('common.enabled');
                    if (args[2].equalsIgnoreCase('false')) warningMessage = false, actionArg2 = $.lang.get('common.disabled');
                    $.inidb.set('heistSettings', 'warningMessage', warningMessage);
                }

                /**
                 * @commandpath heist set entrymessages [true / false] - Sets the per-user entry messages
                 */
                if (actionArg1.equalsIgnoreCase('entrymessages')) {
                    if (args[2].equalsIgnoreCase('true')) enterMessage = true, actionArg2 = $.lang.get('common.enabled');
                    if (args[2].equalsIgnoreCase('false')) enterMessage = false, actionArg2 = $.lang.get('common.disabled');
                    $.inidb.set('heistSettings', 'enterMessage', enterMessage);
                }

                /**
                 * @commandpath heist set cooldownannounce [true / false] - Sets the cooldown announcement
                 */
                if (actionArg1.equalsIgnoreCase('cooldownannounce')) {
                    if (args[2].equalsIgnoreCase('true')) coolDownAnnounce = true, actionArg2 = $.lang.get('common.enabled');
                    if (args[2].equalsIgnoreCase('false')) coolDownAnnounce = false, actionArg2 = $.lang.get('common.disabled');
                    $.inidb.set('heistSettings', 'coolDownAnnounce', coolDownAnnounce);
                }

                $.say($.whisperPrefix(sender) + $.lang.get('heistsystem.set.success', actionArg1, actionArg2));
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/heistSystem.js')){
            $.registerChatCommand('./custom/games/heistSystem.js', 'heist', 7);
            $.registerChatSubcommand('heist', 'set', 1);
            $.registerChatSubcommand('heist', 'top5', 3);

            loadStories();
        }
    });

    $.reloadHeist = reloadHeist;
})();
