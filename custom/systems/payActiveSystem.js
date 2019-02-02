/**
 * payactiveSystem.js
 *
 * A module that will pay out extra points to active users within toggles.
 *
 * Current version 1.1.0
 *
 * Original author: Alixe (https://community.phantombot.tv/t/payactive-command-to-pay-out-active-users/2351)
 *
 * Contributors:
 * ArthurTheLastAncient
 *
 */

(function() {
    var payout = $.getSetIniDbNumber('payactive', 'payout', 5);
    var active = $.getSetIniDbBoolean('payactive', 'active', false);
    var chatMessage = $.getSetIniDbBoolean('payactive', 'chatMessage', true);
    var userEntryMessage = $.getSetIniDbBoolean('payactive', 'userEntryMessage', true);
    var userStore = [];

    /**
     * @function reloadPayActive
     *
     * Reloads payactiveSystem settings
     *
     * Parameters: n/a
     */
    function reloadPayActive() {
        payout = $.getIniDbNumber('payactive', 'payout');
        active = $.getIniDbBoolean('payactive', 'active');
        chatMessage = $.getIniDbBoolean('payactive', 'chatMessage');
        userEntryMessage = $.getIniDbBoolean('payactive', 'userEntryMessage');
        userStore = [];
    }

    /**
     * @function payPayActive
     *
     * Pays out points to users who have been active in the period between toggles.
     *
     * Parameters: n/a
     */
    function payPayActive() {
        var payoutCount = 0;
        var payoutList = Object.keys(userStore).join(', ');

        while (Object.keys(userStore).length > 0) {
            $.inidb.incr('points', Object.keys(userStore).shift(), payout);
            delete userStore[Object.keys(userStore).shift()];
            payoutCount++;
        }

        if (chatMessage) {
            if (payoutCount == 1) {
                $.say($.lang.get('payactive.paid.pass', payoutCount, 'user'));
                $.say($.lang.get('payactive.active.user', payoutList));
            } else if (payoutCount > 1)  {
                $.say($.lang.get('payactive.paid.pass', payoutCount, 'users'));
                $.say($.lang.get('payactive.active.users', payoutList));
            } else {
                $.say($.lang.get('payactive.paid.fail', payoutCount, 'user'));
            }
        }
    }

    /**
     * @function messageListener
     * 
     * Hook for @event ircChannelMessage
     *
     * Parameters:
     * @object event
     */
    function messageListener(event) {
        var sender = event.getSender().toLowerCase();
        var message = event.getMessage();
        var ranked_sender = $.username.resolve(sender);
    
        if (active) {
            if (!message.startsWith('!') && !$.isTwitchBot(sender)) {
                if (userStore[sender] !== true) {
                    userStore[sender] = true;
                    if (userEntryMessage) {
                        $.say($.lang.get('payactive.add.pass', ranked_sender));
                    }
                }
            }          
        }
    }
    
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1],
            actionValue = args[2];
        
        

        if (command.equalsIgnoreCase('payactive')) {
            var ranked_sender = $.username.resolve(sender);

            if (!action) {
                if (!active) {
                    userStore = [];
                    $.bind('ircChannelMessage', messageListener);
                    active = true;
                    $.say($.lang.get('payactive.enabled.pass', ranked_sender));
                } else {
                    active = false;
                    $.unbind('ircChannelMessage', messageListener);
                    payPayActive();
                    $.say($.lang.get('payactive.disabled.pass', ranked_sender));
                }
            } else {
                if (action.equalsIgnoreCase('set')) {

                    if (subAction.equalsIgnoreCase('payout')) {
                        var intAction = parseInt(actionValue);
                        if (isNaN(intAction)) {
                            $.say($.lang.get('payactive.set.payout.usage', ranked_sender));                         
                        } else {
                            payout = intAction,
                            $.setIniDbNumber('payactive', 'payout', payout);
                            $.say($.lang.get('payactive.set.payout.pass', ranked_sender, $.getPointsString(payout)));
                        }
                    }

                    if (subAction.equalsIgnoreCase('chatmessage')) {
                        if (!actionValue) {
                            $.say($.lang.get('payactive.set.chatmessage.usage', ranked_sender));
                        } else {
                            if (actionvalue.equalsIgnoreCase('false')) {
                                chatMessage = false;
                                $.setIniDbBoolean('payactive', 'chatMessage', false);
                                $.say($.lang.get('payactive.set.chatmessage.disabled', ranked_sender));
                            } else if (actionvalue.equalsIgnoreCase('true')) {
                                chatMessage = true;
                                $.setIniDbBoolean('payactive', 'chatMessage', true);
                                $.say($.lang.get('payactive.set.chatmessage.enabled', ranked_sender));
                            } else {
                                $.say($.lang.get('payactive.set.chatmessage.usage', ranked_sender));
                            }
                        }
                    }

                    if (subAction.equalsIgnoreCase('userentrymessage')) {
                        if (!actionValue) {
                            $.say($.lang.get('payactive.set.userentrymessage.usage', ranked_sender));
                        } else {
                            if (actionvalue.equalsIgnoreCase('false')) {
                                userEntryMessage = false;
                                $.setIniDbBoolean('payactive', 'userEntryMessage', false);
                                $.say($.lang.get('payactive.set.userentrymessage.disabled', ranked_sender));
                            } else if (actionvalue.equalsIgnoreCase('true')) {
                                userEntryMessage = true;
                                $.setIniDbBoolean('payactive', 'userEntryMessage', true);
                                $.say($.lang.get('payactive.set.userentrymessage.enabled', ranked_sender));
                            } else {
                                $.say($.lang.get('payactive.set.userentrymessage.usage', ranked_sender));
                            }
                        }
                    }
                }

                if (action.equalsIgnoreCase('check')) {
                    payout = $.getIniDbNumber('payactive', 'payout');
                    $.say($.lang.get('payactive.check.pass', ranked_sender, $.getPointsString(payout)));
                }
            }
        }

        if (command.equalsIgnoreCase('reloadpayactive')) {
	        reloadPayActive();
	    }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/systems/payActiveSystem.js')){
            $.registerChatCommand('./custom/systems/payActiveSystem.js', 'payactive', 2);
            $.registerChatSubcommand('payactive', 'set', 1);
            $.registerChatSubcommand('payactive', 'check', 1);

            $.registerChatCommand('./custom/systems/payActiveSystem.js', 'reloadpayactive', 30);
            active = false;
        }
    });
})();