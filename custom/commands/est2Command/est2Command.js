 /**
 * est2Command.js
 *
 * Custom script that will look up the rout or payout of the current job for ETS2!
 *
 * Current version 1.1.0
 *
 * Original author: Alixe
 *
 * Contributors:
 * NeedyPlays
 *
 */
(function() {

    var selectedServer = $.getSetIniDbString('est2Settings', 'selectedServer', 'EU3');
        selectedCurrency = $.getSetIniDbString('est2Settings', 'selectedCurrency', '€');
        serverAddress = $.getSetIniDbString('est2Settings', 'serverAddress', '127.0.0.1');

    function reloadSettings() {
        selectedServer = $.getIniDbString('est2Settings', 'selectedServer');
        selectedCurrency = $.getIniDbString('est2Settings', 'selectedCurrency');
        serverAddress = $.getIniDbString('est2Settings', 'serverAddress');
    }

    /**
     * get the json data!
     */
    function _getJSON(url){
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var h = new HashMap();
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, encodeURI(url), '', h);
        return responseData.content;
    }

    /**
     * function getRoute
     * get the Route i am taking!
     */
    function getRoute (ranked_sender, streamerName, selectedServer){
        var serverAddress = $.getIniDbString('est2Settings', 'serverAddress');

        var json = JSON.parse(_getJSON("http://"+serverAddress+":25555/api/ets2/telemetry"));

        if (json === null) {
            $.say($.lang.get('est2.server.404', ranked_sender, streamerName));
            return;
        } else {
            var isConnected = json.game.connected,
                isOnline = json.game.gameName,
                selectJob = json.job;

            if (isConnected === true && isOnline === 'ETS2') {

                if (selectJob) {
                    var fromLocation = json.job.sourceCity,
                        fromCompany = json.job.sourceCompany,
                        toLocation = json.job.destinationCity,
                        toCompany = json.job.destinationCompany;

                    if (fromLocation && toLocation) {
                        $.say($.lang.get('est2.route', ranked_sender, streamerName, fromLocation + ' (' + fromCompany + ')', toLocation + ' (' + toCompany + ')', selectedServer));
                        return;
                    } else {
                        $.say($.lang.get('est2.route.404', ranked_sender, streamerName));
                        return;
                    }
                } else {
                    $.say($.lang.get('est2.route.404', ranked_sender, streamerName));
                    return;
                }
            } else {
                $.say($.lang.get('est2.connections.404', ranked_sender, streamerName));
                return;
            }
        }
    }

    /**
     * function getPayout
     * get the Payout of my current job!
     */
    function getPayout (ranked_sender, streamerName, selectedCurrency){
        var serverAddress = $.getIniDbString('est2Settings', 'serverAddress');

        var json = JSON.parse(_getJSON("http://"+serverAddress+":25555/api/ets2/telemetry"));

        var isConnected = json.game.connected,
            isOnline = json.game.gameName,
            selectJob = json.job;

        if (isConnected === true && isOnline === 'ETS2') {

            if (selectJob) {
                var jobIncome = json.job.income;

                if (jobIncome) {
                    $.say($.lang.get('est2.payout', ranked_sender, streamerName, selectedCurrency, jobIncome));
                    return;
                } else {
                    $.say($.lang.get('est2.online.404', ranked_sender, streamerName));
                    return;
                }
            } else {
                $.say($.lang.get('est2.online.404', ranked_sender, streamerName));
                return;
            }
        } else {
            $.say($.lang.get('est2.connections.404', ranked_sender, streamerName));
            return;
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
            action1 = args[1],
            action2 = args[2];

        var ranked_sender = $.username.resolve(sender),
            streamerName = $.username.resolve($.channelName);


        if (command.equalsIgnoreCase('ets2')) {
            if (!action) {
                $.say($.lang.get('est2.useage', ranked_sender));
                return;
            } else {
                if (action.equalsIgnoreCase('route')) {
                    getRoute(ranked_sender, streamerName, selectedServer);
                    return;
                } else if (action.equalsIgnoreCase('payout')) {
                    getPayout(ranked_sender, streamerName, selectedCurrency);
                    return;
                } else if (action.equalsIgnoreCase('set')) {
                    if (!action1) {
                        $.say($.lang.get('est2.set.useage', ranked_sender));
                        return;
                    } else if (action1.equalsIgnoreCase('server')) {
                        if (action2) {
                            $.say($.lang.get('est2.set.server', ranked_sender, action2));
                            $.setIniDbString('est2Settings', 'selectedServer', action2);
                            reloadSettings();
                            return;
                        } else {
                            $.say($.lang.get('est2.set.server.useage', ranked_sender));
                        }
                    } else if (action1.equalsIgnoreCase('address')) {
                        if (action2) {
                            $.say($.lang.get('est2.set.address', ranked_sender, action2));
                            $.setIniDbString('est2Settings', 'serverAddress', action2);
                            reloadSettings();
                            return;
                        } else {
                            $.say($.lang.get('est2.set.address.useage', ranked_sender));
                        }
                    } else if (action1.equalsIgnoreCase('currency')) {
                        if (action2) {
                            $.say($.lang.get('est2.set.currency', ranked_sender, action2));
                            $.setIniDbString('est2Settings', 'selectedCurrency', action2);
                            reloadSettings();
                            return;
                        } else {
                            $.say($.lang.get('est2.set.currency.useage', ranked_sender));
                            return;
                        }
                    } else {
                        $.say($.lang.get('est2.set.useage', ranked_sender));
                        return;
                    }
                } else {
                    $.say($.lang.get('est2.useage', ranked_sender));
                    return;
                }
            }
		}
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/commands/est2Command.js')){
            $.registerChatCommand('./custom/commands/est2Command.js', 'ets2', 7);
            $.registerChatSubcommand('ets2', 'route', 1);
            $.registerChatSubcommand('ets2', 'set', 1);
        }
    });
})();