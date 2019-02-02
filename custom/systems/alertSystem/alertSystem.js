 /**
 * alertSystem.js
 *
 * A module that will send custom alerts to the notificationHandler.js
 *
 * Current version 1.0.0
 *
 * Original author: Alixe
 *
 * Contributors:
 * ArthurTheLastAncient
 *
 */
function capsText(str) {
    var s2 = str.trim().toLowerCase().split(' ');
  var s3 = [];
  s2.forEach(function(elem) {
          s3.push(elem.charAt(0).toUpperCase().concat(elem.substring(1)));
  });
  return s3.join(' ');
}

(function() {
    var twitter,
        game,
        currentUnixTime,
        alertDelay;

    var customAlertQueue = new java.util.concurrent.ConcurrentLinkedQueue(), // initialize queue 
        lastCustomAlert = $.systemTime(); // set default alert time

    var twitchFollow = $.getSetIniDbBoolean('onScreenAlerts', 'twitchFollow', false),
        twitchHosted = $.getSetIniDbBoolean('onScreenAlerts', 'twitchHosted', false),
        twitchAutoHosted = $.getSetIniDbBoolean('onScreenAlerts', 'twitchAutoHosted', false),
        twitchBits = $.getSetIniDbBoolean('onScreenAlerts', 'twitchBits', false),
        twitchRaid = $.getSetIniDbBoolean('onScreenAlerts', 'twitchRaid', false),
        twitchClip = $.getSetIniDbBoolean('onScreenAlerts', 'twitchClip', false),
        twitchSubscriber = $.getSetIniDbBoolean('onScreenAlerts', 'twitchSubscriber', false),
        twitterRetweet = $.getSetIniDbBoolean('onScreenAlerts', 'twitterRetweet', false), 
        discordChannelJoin = $.getSetIniDbBoolean('onScreenAlerts', 'discordChannelJoin', false),
        streamElementsDonation = $.getSetIniDbBoolean('onScreenAlerts', 'streamElementsDonation', false),
        streamLabsDonation = $.getSetIniDbBoolean('onScreenAlerts', 'streamLabsDonation', false),
        tipeeeStreamDonation = $.getSetIniDbBoolean('onScreenAlerts', 'tipeeeStreamDonation', false);

    function reloadAlerts () {
        twitchFollow = $.getIniDbBoolean('onScreenAlerts', 'twitchFollow');
        twitchHosted = $.getIniDbBoolean('onScreenAlerts', 'twitchHosted');
        twitchAutoHosted = $.getIniDbBoolean('onScreenAlerts', 'twitchAutoHosted');
        twitchBits = $.getIniDbBoolean('onScreenAlerts', 'twitchBits');
        twitchRaid = $.getIniDbBoolean('onScreenAlerts', 'twitchRaid');
        twitchClip = $.getIniDbBoolean('onScreenAlerts', 'twitchClip');
        twitchSubscriber = $.getIniDbBoolean('onScreenAlerts', 'twitchSubscriber');
        twitterRetweet = $.getIniDbBoolean('onScreenAlerts', 'twitterRetweet');
        discordChannelJoin = $.getIniDbBoolean('onScreenAlerts', 'discordChannelJoin');
        streamElementsDonation = $.getIniDbBoolean('onScreenAlerts', 'streamElementsDonation');
        streamLabsDonation = $.getIniDbBoolean('onScreenAlerts', 'streamLabsDonation');
        tipeeeStreamDonation = $.getIniDbBoolean('onScreenAlerts', 'tipeeeStreamDonation');
        tipeeeStreamDonation = $.getIniDbBoolean('onScreenAlerts', 'tipeeeStreamDonation');
    }

    /**
     * send the alert to the weblink!
     */
    function sendCustomAlert(sender, message) {
        var ranksender;
        if ($.username.resolve(sender).toLowerCase() != sender.toLowerCase()) {
            ranksender = $.username.resolve(sender) + " [" + sender + "]";
        } else {
            ranksender = $.username.resolve(sender);
        }
        var alertOptions = ['<alert><header>' + ranksender + ' <alert><text>' + message, '<alert><false>'];
        customAlertQueue.add(alertOptions);
    }

    /*
     * @function runAlerts
     */
    function runAlerts() {
        if($.bot.isModuleEnabled('./custom/systems/alertSystem.js')){
            alertDelay = 10; // seconds
            if (!customAlertQueue.isEmpty() && (lastCustomAlert + (alertDelay * 1e3) < $.systemTime())) {// sending 
                var alertData = customAlertQueue.poll();
                $.panelsocketserver.alertImage(alertData[0]);
                $.panelsocketserver.alertImage(alertData[1]);

                lastCustomAlert = $.systemTime();
            }
        }
    }

    /*
     * @event twitchFollow
     */
    $.bind('twitchFollow', function(event) {
        var follower = event.getFollower();

        if(twitchFollow) {
            sendCustomAlert(follower, 'Has followed the channel');
        }  
        return;      
    });

    /*
     * @event twitchHosted
     */
    $.bind('twitchHosted', function(event) {
        var hoster = event.getHoster().toLowerCase(),
            viewers = parseInt(event.getUsers());

        if(twitchHosted) {
            sendCustomAlert(hoster, 'Has hosted with ' + viewers + ' Viewers');
        }
        return;
    });

    /*
     * @event twitchAutoHosted
     */
    $.bind('twitchAutoHosted', function(event) {
        var hoster = event.getHoster().toLowerCase(),
            viewers = parseInt(event.getUsers());

        if(twitchAutoHosted) {
            sendCustomAlert(hoster, 'Has auto-hosted with ' + viewers + ' Viewers');
        }
        return;
    });

    /*
     * @event twitchBits
     */
    $.bind('twitchBits', function(event) {
        var username = event.getUsername(),
            bits = event.getBits();

        if(twitchBits) {
            sendCustomAlert(username, 'Has cheered with ' + bits + ' bits');
        }
        return;
    });

    /*
     * @event twitchRaid
     */
    $.bind('twitchRaid', function(event) {
        var raider = event.getUsername().toLowerCase(),
            viewers = parseInt(event.getViewers());

        if(twitchRaid) {
            sendCustomAlert(raider, 'Has raided with ' + viewers + ' Viewers');
        }
        return;
    });

    /*
     * @event twitchClip
     */
    $.bind('twitchClip', function(event) {
        var creator = event.getCreator(),
            url = event.getClipURL();

        if(twitchClip) {
            sendCustomAlert(creator, 'Has clipped the stream: ' + url);
        }
        return;
    });

    /*
     * @event twitchSubscriber
     */
    $.bind('twitchSubscriber', function(event) {
        var subscriber = event.getSubscriber(),
            plan = event.getPlan();

        if(twitchSubscriber) {
            sendCustomAlert(subscriber, 'Has subscribed to the stream for ' + plan);
        }
        return;
    });

    /*
     * @event twitchPrimeSubscriber
     */
    $.bind('twitchPrimeSubscriber', function(event) {
        var subscriber = event.getSubscriber();


        if(twitchSubscriber) {
            sendCustomAlert(subscriber, 'Has subscribed to the stream with prime');
        }
        return;
    });

    /*
     * @event twitchReSubscriber
     */
    $.bind('twitchReSubscriber', function(event) {
        var subscriber = event.getSubscriber(),
            //months = event.getMonths(),
            plan = event.getPlan();

        if(twitchSubscriber) {
            sendCustomAlert(subscriber, 'Has re-subscribed to the stream for ' + plan);
        }
        return;
    });

    /*
     * @event twitchSubscriptionGift
     */
    $.bind('twitchSubscriptionGift', function(event) {
        var gifter = event.getUsername(),
            recipient = event.getRecipient(),        
            //months = event.getMonths(),
            plan = event.getPlan();

        if(twitchSubscriber) {
            sendCustomAlert(gifter, 'Has gifted ' + recipient + ' a sub to the stream for ' + plan);
        }
        return;
    });

    /*
     * @event twitchMassSubscriptionGifted
     */
    $.bind('twitchMassSubscriptionGifted', function(event) {
        var gifter = event.getUsername(),
            amount = event.getAmount(),
            plan = event.getPlan();

        if(twitchSubscriber) {
            sendCustomAlert(gifter, 'Has gifted ' + amount + ' subscriptions to random users in the stream for ' + plan);
        }
        return;
    });

    /**
     * @event twitterRetweet
     */
    $.bind('twitterRetweet', function(event) {
        var i;
        
        if (!$.bot.isModuleEnabled('./handlers/twitterHandler.js')) {
            return;
        }

        var userNameArray = event.getUserNameArray(),
            cooldown = $.getIniDbFloat('twitter', 'reward_cooldown') * 3.6e6,
            now = $.systemTime();

        for (i in userNameArray) {
            var twitterUserName = userNameArray[i].toLowerCase(),
                username = $.inidb.GetKeyByValue('twitter_mapping', '', twitterUserName);
            if (username == null) {
                return;
            }

            var lastRetweet = $.getIniDbNumber('twitter_user_last_retweet', username, 0);
            if (now - lastRetweet > cooldown) {
                if(twitterRetweet) {
                    sendCustomAlert(username, 'Has tweeted out the stream');
                }
                return;
            }
        }
    });

    /*
     * @event discordChannelJoin
     */
    $.bind('discordChannelJoin', function(event) {
        if (!$.bot.isModuleEnabled('./discord/systems/greetingsSystem.js')) {
            return;
        }

        var username = event.getUsername();

        if(discordChannelJoin) {
            sendCustomAlert(username, 'Has joined our discord');
        }
        return;
    });

    /*
     * @event streamElementsDonation
     */
    $.bind('streamElementsDonation', function(event) {
        if (!$.bot.isModuleEnabled('./handlers/streamElementsHandler.js')) {
            return;
        }

        var donationJsonStr = event.getJsonString(),
            JSONObject = Packages.org.json.JSONObject,
            donationJson = new JSONObject(donationJsonStr),
            paramObj = donationJson.getJSONObject('donation'),
            donationUsername = paramObj.getJSONObject('user').getString('username'),
            donationAmount = paramObj.getInt('amount'),
            donationCurrency = paramObj.getString('currency');

        if(streamElementsDonation) {
            sendCustomAlert(donationUsername, 'Has donated ' + donationAmount + ' ' + donationCurrency + ', Thanks <3');
        }
        return;
    });

    /*
     * @event streamLabsDonation
     */
    $.bind('streamLabsDonation', function(event) {
        if (!$.bot.isModuleEnabled('./handlers/streamlabsHandler.js')) {
            return;
        }

        var donationJsonStr = event.getJsonString(),
            JSONObject = Packages.org.json.JSONObject,
            donationJson = new JSONObject(donationJsonStr),
            donationUsername = donationJson.getString("name"),
            donationAmount = donationJson.getString("amount"),
            donationCurrency = donationJson.getString("currency");

        if(streamLabsDonation) {
            sendCustomAlert(donationUsername, 'Has donated ' + donationAmount + ' ' + donationCurrency + ', Thanks <3');
        }
        return;
    });

    /*
     * @event tipeeeStreamDonation
     */
    $.bind('tipeeeStreamDonation', function(event) {
        if (!$.bot.isModuleEnabled('./handlers/tipeeeStreamHandler.js')) {
            return;
        }

        var jsonString = event.getJsonString(),
            JSONObject = Packages.org.json.JSONObject,
            donationObj = new JSONObject(jsonString),
            //donationID = donationObj.getInt('id'),
            paramObj = donationObj.getJSONObject('parameters'),
            donationUsername = paramObj.getString('username'),
            donationAmount = paramObj.getInt('amount'),
            donationCurrency = paramObj.getString('currency');
            
        if(tipeeeStreamDonation) {
            sendCustomAlert(donationUsername, 'Has donated ' + donationAmount + ' ' + donationCurrency + ', Thanks <3');
        }
        return;
    });

    /**
     * @event ircPrivateMessage
     */
    $.bind('ircPrivateMessage', function(event) {
        var message = event.getMessage().toLowerCase();

        if (message.indexOf('hosting') != -1) {
            if (message.indexOf('already') != -1) {
                return;
            }
            var target = String(message).replace(/now hosting /ig, '').replace(/\./ig, '');

            if (target.equalsIgnoreCase('-')) {
                $.bot.channelIsHosting = null;
                $.say($.lang.get('alert.twitch.fail'));
            } else {
                $.bot.channelIsHosting = target;

                //Post the host onto twitter.
                if ($.inidb.exists('twitterAlerts', target)) {
                    twitter = $.getSetIniDbString('twitterAlerts', target, target);
                    game = $.getGame(target),
                    latestUser = $.getSetIniDbString('twitterSetings', "latestUser", target);
                    currentUnixTime = parseInt(Math.floor(Date.now() / 1000)),
                    latestUnixTime = parseInt($.getSetIniDbString('twitterSetings', "latestTime", currentUnixTime)) + 1200;

                    if (currentUnixTime >= latestUnixTime) {
                        var words = ['saurel','kemble','sealer','wiving','bertie','sconce','onyxis','sociol','kassel','mayfly','cocoon','jingle','unwily','nimble','throne','inward','zambia','ochone','pyrrha','sandra','banded','scarph','dismay','sharon','orrery','carton','viscus','sprint','menyie','poised','litter','cloven','henryk','dryope','ladler','slider','twelve','itonia','earful','dosser','mester','unplug','daggle','lusaka','isotac','morrow','bireme','blazon','orneus','sacker','podded','sweaty','argufy','iarbas','yahata','dosing','dorser','pleiad','elatus','davina','tawney','dopper','haggis','schizo','bareli','trough','motown','wanton','silica','ziwiye','unmast','chemmy','plaice','votyak','innate','remint','snugly','washin','wisent','august','dollar','dabble','nessus','vainly','lindon','partly','pilfer','mouthy','vaguio','verset','heliac','nuggar','swivet','extoll','acarid','cannon','cuirie','hallal','ridden'],
                            a = capsText(words[Math.floor(Math.random()*words.length)]),
                            b = capsText(words[Math.floor(Math.random()*words.length)]),
                            c = capsText(words[Math.floor(Math.random()*words.length)]);

                        if (latestUser != target) {
                            $.twitter.updateStatus($.lang.get('alert.twitter.post', twitter, game, target, a+b+c));
                            $.setIniDbString('twitterSetings', "latestUser", target);
                            $.setIniDbString('twitterSetings', "latestTime", currentUnixTime);
                        }
                    }
                }                
            }
        }
    });


    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action0 = args[0],
            action1 = args[1],
            action2 = args[2];

        var ranked_sender = $.username.resolve(sender);

        //Todo List
        if (command.equalsIgnoreCase('alert')) {
            if (!action0) {
                $.say($.lang.get('alert.fail', ranked_sender));
            } else {
                if (action0.equalsIgnoreCase('twitter')) {
                    if (!action1) {
                        $.say($.lang.get('alert.twitter.fail', ranked_sender));
                    } else {
                        if (!action2) {
                            $.setIniDbString('twitterAlerts', action1, action1);
                            $.say($.lang.get('alert.twitter.pass', ranked_sender, action1, action1));
                        } else {
                            $.setIniDbString('twitterAlerts', action1, action2);
                            $.say($.lang.get('alert.twitter.pass', ranked_sender, action1, action2));
                        }
                    }
                } else if (action0.equalsIgnoreCase('toggle')) {
                    if (!action1) {
                        $.say($.lang.get('alert.toggle.fail', ranked_sender));
                    } else {
                        var onScreenAction = $.getIniDbBoolean('onScreenAlerts', action1);
                        if (onScreenAction == null) {
                            $.say($.lang.get('alert.toggle.setting.fail', ranked_sender, action1));
                        } else {
                            onScreenAction = !onScreenAction;
                            $.inidb.set('onScreenAlerts', action1, onScreenAction);
                            $.say($.lang.get('alert.toggle.setting.pass', ranked_sender, action1, (onScreenAction === true ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
                        }
                    }
                } else if (action0.equalsIgnoreCase('retweet')) {
                    if (!action1) {
                        $.say($.lang.get('alert.retweet.fail', ranked_sender));
                    } else {
                        $.bot.channelIsHosting = action1;

                        //Post the host onto twitter.
                        twitter = $.getSetIniDbString('twitterAlerts', action1, action1);
                        game = $.getGame(action1);
                        currentUnixTime = parseInt(Math.floor(Date.now() / 1000));
                      
                        $.say($.lang.get('alert.retweet.pass', ranked_sender, action1));
                        $.twitter.updateStatus($.lang.get('alert.twitter.post', twitter, game, action1, currentUnixTime));
                        $.setIniDbString('twitterSetings', "latestUser", action1);
                        $.setIniDbString('twitterSetings', "latestTime", currentUnixTime);
                    }
                } else if (action0.equalsIgnoreCase('test')) {
                    var types = ['Has followed the channel', 'Has hosted with {X} Viewers','Has auto-hosted with {X} Viewers','Has cheered with {X} Bits','Has raided with {X} Viewers','Has clipped the stream: {URL}','Has subscribed to the stream for {PLAN}','Has re-subscribed to the stream for {PLAN}','Has gifted {PLAN} a sub to the stream for {PLAN}','Has tweeted out the stream','Has joined our discord','Has donated {AMOUNT}, Thanks'],
                    rand_type = types[Math.floor(Math.random()*types.length)];
                    sendCustomAlert(sender, rand_type);
                } else {
                    $.say($.lang.get('alert.fail', ranked_sender));
                }
            }
        }

        if (command.equalsIgnoreCase('reloadalerts')) {
            reloadAlerts();
        }
    });


    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/systems/alertSystem.js')){
            $.registerChatCommand('./custom/systems/alertSystem.js', 'alert', 1);
            $.registerChatSubcommand('alert', 'twitter', 1);
            $.registerChatSubcommand('alert', 'retweet', 1);
            $.registerChatSubcommand('alert', 'toggle', 1);
            $.registerChatSubcommand('alert', 'test', 1);

            $.registerChatCommand('./custom/systems/alertSystem.js', 'reloadalerts', 30);
        }
    });

    setTimeout(function() {
        setInterval(function() { runAlerts(); }, 5e3, 'scripts::custom::systems::alertSystem.js');
    }, 5e3);

    $.reloadAlerts = reloadAlerts;
})();
