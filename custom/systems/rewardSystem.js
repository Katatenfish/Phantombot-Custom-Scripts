/**
 * rewardSystem.js
 *
 * Command handler for a reward system!
 */
(function() {
    var channelName = $.getSetIniDbString('rewardSettings', 'postTo', 'notifications'),
        reward_announce = $.getSetIniDbBoolean('rewardSettings', 'announce', false);

    /**
     * @function reloadReward
     */
    function reloadReward() {
        channelName = $.getIniDbString('rewardSettings', 'postTo'),
        reward_announce = $.getIniDbBoolean('rewardSettings', 'announce');
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
            points_sender = $.inidb.get('points', sender);

        var redeemItems = $.inidb.GetKeyList('rewardItem', '');
    	var redeemNames = [];
        for (var i = 0; i < redeemItems.length; i++) {
            redeemNames.push(redeemItems[i] + '. ' + $.inidb.get('rewardItem', redeemItems[i]) + ' (' + $.inidb.get('rewardCost', redeemItems[i]) + ')');   
        }

        if (command.equalsIgnoreCase('redeem')) {
            if (!action) {
                $.paginateArray(redeemNames, 'redeem.usage', ', ', true, sender);
                return;
            } else {
                if (action.equalsIgnoreCase('edit')) {
                    if (args.length < 3) {
                        $.say($.lang.get('redeem.edit.usage', ranked_sender, redeemNames.join(', ')));
                        return;
                    }
                    if (isNaN(args[1])) {
                        $.say($.lang.get('redeem.edit.usage', ranked_sender, redeemNames.join(', ')));
                        return;
                    }
                    if (isNaN(args[2])) {
                        $.say($.lang.get('redeem.edit.usage', ranked_sender, redeemNames.join(', ')));
                        return;
                    }

                    redeemNumber = args[1];
                    redeemCost = args[2];
                    redeemItem = args.splice(3).join(' ');

                    isReplace = $.inidb.exists('rewardItem', redeemNumber);
                    if (isReplace) {
                        if (redeemItem === 'null' || redeemItem === 'remove' || redeemItem === 'delete') {
                            $.inidb.del('rewardCost', redeemNumber);
                            $.inidb.del('rewardItem', redeemNumber);
                            $.say($.whisperPrefix(sender) + $.lang.get('redeem.edit.success-deleted', redeemNumber));
                        } else {
                            $.setIniDbNumber('rewardCost', redeemNumber, redeemCost);
                            $.setIniDbString('rewardItem', redeemNumber, redeemItem);
                            $.say($.whisperPrefix(sender) + $.lang.get('redeem.edit.success-update', redeemNumber, $.getPointsString(redeemCost), redeemItem));
                        }
                    } else {
                        $.setIniDbNumber('rewardCost', redeemNumber, redeemCost);
                        $.setIniDbString('rewardItem', redeemNumber, redeemItem);
                        $.say($.whisperPrefix(sender) + $.lang.get('redeem.edit.success-new', redeemNumber, $.getPointsString(redeemCost), redeemItem));
                    }
                    return;
                } else if (action.equalsIgnoreCase('toggle')) { 
                    reward_announce = !reward_announce;
                    $.setIniDbBoolean('rewardSettings', 'announce', reward_announce);
                    reloadReward();
				    $.say($.lang.get('reward.toggle.announce', ranked_sender, reward_announce ? 'enabled' : 'disabled'));
                } else if (action.equalsIgnoreCase('channel')) { 
                    if (args[1] !== undefined) {
                        $.setIniDbBoolean('rewardSettings', 'postTo', args[1]);
                        reloadReward();
				        $.say($.lang.get('reward.postto.announce', ranked_sender, args[1]));
                    } else {
                        $.say($.lang.get('reward.postto.usage', ranked_sender));
                    }
                } else {
                    rewards = $.getIniDbString('rewardItem', action);
                    cost = $.getIniDbNumber('rewardCost', action);
                    if (points_sender > cost) {
                        if (rewards) {
                            $.say($.lang.get('redeem.reward.accept', ranked_sender, rewards, $.getPointsString(cost)));
                            $.panelsocketserver.alertImage('redeem'+action+'.gif');
                            $.writeToFile(ranked_sender + ' Claimed ' + rewards, './addons/logFiles/rewards/redeems.txt', true);
                            if (reward_announce) {
                                $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                                    .withColor(244, 108, 108)
                                    .withThumbnail('https://raw.githubusercontent.com/PhantomBot/Miscellaneous/master/Discord-Embed-Icons/host-embed-icon.png')
                                    .withTitle($.lang.get('discord.reward.announce.embedtitle'))
                                    .appendDescription(ranked_sender + ' Claimed ' + rewards)
                                    .withTimestamp(Date.now())
                                    .withFooterText('Twitch')
                                    .withFooterIcon($.twitchcache.getLogoLink()).build());
                            }
                            $.inidb.decr('points', sender, cost);
                        } else {
                            $.say($.lang.get('redeem.reward.decline', ranked_sender, action));
                        }
                    } else {
                        if (rewards) {
                            $.say($.lang.get('redeem.reward.nocost', ranked_sender, $.pointNameMultiple, rewards));
                        } else {
                            $.say($.lang.get('redeem.reward.decline', ranked_sender, action));
                        }
                    }
                    return;
                }
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/systems/rewardSystem.js')){
            $.registerChatCommand('./custom/systems/rewardSystem.js', 'redeem', 7);
            $.registerChatSubcommand('redeem', 'toggle', 1);
            $.registerChatSubcommand('redeem', 'edit', 1);
        }
    });
})();