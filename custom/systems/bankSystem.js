/**
 * bankSystem.js
 *
 * A module that will let you bank your currency.
 */

(function() {
    runInterestTimer();
    var interval = $.getSetIniDbNumber('bankSettings', 'interval', 600),
        payout = $.getSetIniDbBoolean('bankSettings', 'payout', false),
        online = $.getSetIniDbBoolean('bankSettings', 'online', false),
        currency = $.getSetIniDbString('bankSettings', 'currency', 'diamond'),
        points_target;

    /**
     * @function reloadBank
     */
    function reloadBank() {
        interval = $.getIniDbNumber('bankSettings', 'interval'),
        payout = $.getIniDbBoolean('bankSettings', 'payout'),
        online = $.getIniDbBoolean('bankSettings', 'online'),
        currency = $.getIniDbString('bankSettings', 'currency');
    }

    /**
     * @function runInterestPayout
     */
    function runInterestPayout() {
        var interest = $.getSetIniDbNumber('bankSettings', 'interest', 5),
            bankAccout,
            username,
            i;

        online = $.inidb.get('bankSettings', 'online');
        if (online == 'true') {
            if ($.isOnline($.channelName)) {
                $.inidb.setAutoCommit(false);
                for (i in $.users) {
                    username = $.users[i][0].toLowerCase();

                    bankAccout = parseInt($.inidb.get('bank', username));
                    if (bankAccout > 0) {
                        interest = parseInt($.inidb.get('bankSettings', 'interest')),
                        tax = parseInt((bankAccout * interest) / 100);

                        $.inidb.incr('bank', username, tax);
                    }
                }
                $.inidb.setAutoCommit(true);
                $.say($.lang.get('bank.interest.paid', interest));
            }
        } else {
            $.inidb.setAutoCommit(false);
            for (i in $.users) {
                username = $.users[i][0].toLowerCase();

                bankAccout = parseInt($.inidb.get('bank', username));
                if (bankAccout > 0) {
                    interest = parseInt($.inidb.get('bankSettings', 'interest')),
                    tax = parseInt((bankAccout * interest) / 100);

                    $.inidb.incr('bank', username, tax);
                }
            }
            $.inidb.setAutoCommit(true);
            $.say($.lang.get('bank.interest.paid', interest));
        }
    }

    /**
    * @function runInterestTimer
    */
    function runInterestTimer() {
        payout = $.inidb.get('bankSettings', 'payout');
        interval = $.inidb.get('bankSettings', 'interval');
        interval = getMilliSeconds(interval);
        setTimeout(function() {
            if (payout == 'true') {
                runInterestPayout();
            }
            runInterestTimer();
        }, interval);
    }

    /**
     * @function getBanksString
     * @param banked
     */
    function getBanksString(banked) {
        if (banked != undefined && currency != undefined) {
            return banked + ' ' + currency;
        }
    }

    /**
     * @function getMilliSeconds
     */
    function getMilliSeconds(num){
        return num  * 1000;
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action1 = args[0],
            action2 = args[1],
            action3 = args[2],
            intAction1 = parseInt(args[0]),
            intAction2 = parseInt(args[1]);

        var bank_sender = $.getSetIniDbNumber('bank', sender, 0),
            points_sender = $.getSetIniDbNumber('points', sender, 0),
            ranked_sender = $.username.resolve(sender);


        var targetUser,
            amountAdded,
            amountBanked;
            

        //Todo List
        if (command.equalsIgnoreCase('bank')) {
            if (!action1) {
                $.say($.lang.get('bank.sender.check', ranked_sender, getBanksString(bank_sender), $.getPointsString()));
            } else {
                //Set currency for the bank!
                if (action1.equalsIgnoreCase('currency')) {
                    if (action2) {
                        $.setIniDbNumber('bankSettings', 'currency', action2);
                        reloadBank();
                        $.say($.lang.get('bank.set.currency', ranked_sender, action2));
                    }
                }

                //Add currency to a users bank!
                if (action1.equalsIgnoreCase('add')) {
                    if (!intAction2) {
                        $.say($.lang.get('bank.add.missing', ranked_sender));
                    } else {
                        if (!action3) {
                            $.say($.lang.get('bank.add.missing', ranked_sender));
                        } else {
                            targetUser = $.username.resolve(action3);
                            points_target = $.inidb.get('points', action3);
                            if (points_target) {
                                $.inidb.incr('bank', action3, intAction2);
                                amountAdded = getBanksString(intAction2);
                                amountBanked = $.inidb.get('bank', action3);
                                $.say($.lang.get('bank.add.succeed', ranked_sender, amountAdded, getBanksString(amountBanked), targetUser));
                            } else {
                                $.say($.lang.get('bank.add.fail', ranked_sender, targetUser));
                            }
                        }
                    }
                }

                //Check a users bank account
                if (action1.equalsIgnoreCase('check')) {
                    if (!action2) {
                        $.say($.lang.get('bank.check.missing', ranked_sender));
                    } else {
                        targetUser = $.username.resolve(action2);
                        amountBanked = $.inidb.get('bank', action2);
                        if (amountBanked) {
                           $.say($.lang.get('bank.check.succeed', ranked_sender, targetUser, getBanksString(amountBanked)));
                        } else {
                            $.say($.lang.get('bank.check.fail', ranked_sender, targetUser));
                        }
                    }
                }

                //Set interval for Interest in bank!
                if (action1.equalsIgnoreCase('interval')) {
                    if (!isNaN(action2)) {
                        $.setIniDbNumber('bankSettings', 'interval', action2);
                        reloadBank();
                        $.say($.lang.get('bank.set.interval', ranked_sender, action2));
                    }
                }

                //Set interest for Interest in bank!
                if (action1.equalsIgnoreCase('interest')) {
                    if (!isNaN(action2)) {
                        $.setIniDbNumber('bankSettings', 'interest', action2);
                        reloadBank();
                        $.say($.lang.get('bank.set.interest', ranked_sender, action2));
                    }
                }

                //Activate payout for Interest in bank!
                if (action1.equalsIgnoreCase('payout')) {
                    payout = $.inidb.get('bankSettings', 'payout');
                    if (payout == 'true') {
                        $.setIniDbBoolean('bankSettings', 'payout', false);
                        reloadBank();
                        $.say($.lang.get('bank.set.payout', ranked_sender, 'disabled'));
                    } else {
                        $.setIniDbBoolean('bankSettings', 'payout', true);
                        reloadBank();
                        $.say($.lang.get('bank.set.payout', ranked_sender, 'enabled'));
                    }
                }

                //Activate payout for Interest in bank!
                if (action1.equalsIgnoreCase('online')) {
                    online = $.inidb.get('bankSettings', 'online');
                    if (online == 'true') {
                        $.setIniDbBoolean('bankSettings', 'online', false);
                        reloadBank();
                        $.say($.lang.get('bank.set.online', ranked_sender, 'disabled'));
                    } else {
                        $.setIniDbBoolean('bankSettings', 'online', true);
                        reloadBank();
                        $.say($.lang.get('bank.set.online', ranked_sender, 'enabled'));
                    }
                }
            }

        }

        if (command.equalsIgnoreCase('invest')) {
            if (!intAction1) {

            } else {
                points_sender = $.inidb.get('points', sender);

                if (points_sender >= intAction1) {
                    $.inidb.decr('points', sender, intAction1);
                    $.inidb.incr('bank', sender, intAction1);
                    amountInvested = $.getPointsString(intAction1);
                    amountBanked = $.inidb.get('bank', sender);
                    points_sender = $.getPointsString($.inidb.get('points', sender));
                    $.say($.lang.get('bank.invest.succeed', ranked_sender, amountInvested, getBanksString(amountBanked), points_sender));
                } else {
                    points_sender = $.getPointsString($.inidb.get('points', sender));
                    $.say($.lang.get('bank.invest.fail', ranked_sender, points_sender));
                }
            }
        }

        if (command.equalsIgnoreCase('withdraw')) {
            if (!action1) {

            } else {
                amountBanked = $.inidb.get('bank', sender);

                if (amountBanked >= intAction1) {
                    $.inidb.incr('points', sender, intAction1);
                    $.inidb.decr('bank', sender, intAction1);
                    amountInvested = $.getPointsString(intAction1);
                    amountBanked = $.inidb.get('bank', sender);
                    points_sender = $.getPointsString($.inidb.get('points', sender));
                    $.say($.lang.get('bank.withdraw.succeed', ranked_sender, amountInvested, getBanksString(amountBanked), points_sender));
                } else {
                    amountBanked = $.getPointsString($.inidb.get('bank', sender));
                    $.say($.lang.get('bank.withdraw.fail', ranked_sender, amountBanked));
                }
            }
        }

        if (command.equalsIgnoreCase('reloadbank')) {
            reloadBank();
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/systems/bankSystem.js')){
            $.registerChatCommand('./custom/systems/bankSystem.js', 'bank', 7);
            $.registerChatSubcommand('bank', 'currency', 1);
            $.registerChatSubcommand('bank', 'add', 1);
            $.registerChatSubcommand('bank', 'check', 1);
            $.registerChatSubcommand('bank', 'interval', 1);
            $.registerChatSubcommand('bank', 'interest', 1);
            $.registerChatSubcommand('bank', 'payout', 1);
            $.registerChatSubcommand('bank', 'online', 1);

            $.registerChatCommand('./custom/systems/bankSystem.js', 'invest', 7);
            $.registerChatCommand('./custom/systems/bankSystem.js', 'withdraw', 7);

            $.registerChatCommand('./custom/systems/bankSystem.js', 'reloadbank', 30);
        }
    });
})();
