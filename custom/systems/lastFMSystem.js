/**
 * lastFMSystem.js
 *
 * This command will get the lastes song from LastFM.
 *
 * Current version 1.0.2
 *
 * Original author: Alixe
 *
 * Contributors:
 * UsernamesSuck
 */
(function() {
    var lastfm_username = $.getSetIniDbString('lastfmSettings', 'username', 'username'),
		lastfm_apikey = $.getSetIniDbString('lastfmSettings', 'apikey', 'apikey'),
		lastfm_latest = $.getSetIniDbString('lastfmSettings', 'latest', 'latest'),
		lastfm_announce = $.getSetIniDbBoolean('lastfmSettings', 'announce', true),
		overwrite_youtube = $.getSetIniDbBoolean('lastfmSettings', 'writeYt', false),
		youtube_path = $.getSetIniDbString('ytSettings', 'baseFileOutputPath', './addons/youtubePlayer/');

    /**
     * @function reloadLastFM
     */
    function reloadLastFM() {
        lastfm_username = $.getIniDbString('lastfmSettings', 'username');
        lastfm_apikey = $.getIniDbString('lastfmSettings', 'apikey');
		lastfm_latest = $.getSetIniDbString('lastfmSettings', 'latest', 'latest');
        lastfm_announce = $.getIniDbBoolean('lastfmSettings', 'announce');
		overwrite_youtube = $.getSetIniDbBoolean('lastfmSettings', 'writeYt', false);
		youtube_path = $.getSetIniDbString('ytSettings', 'baseFileOutputPath', './addons/youtubePlayer/');
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

    /*
     * @function checkNextsong
     */
    function checkNextsong() {
		if($.bot.isModuleEnabled('./custom/systems/lastFMSystem.js')){
			live = false;
			if (!lastfm_announce && !overwrite_youtube) {
				return;
			}

			if (lastfm_username == 'username' && lastfm_apikey == 'apikey') {
				$.say($.lang.get('lastfm.error.404', lastfm_username , lastfm_apikey));
				return;
			}

			var json = JSON.parse(_getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + lastfm_username + "&api_key=" + lastfm_apikey + "&format=json"));
			if (json.recenttracks) {
				if (json.recenttracks.track[0].artist) {
					var artist = json.recenttracks.track[0].artist['#text'],
						song = json.recenttracks.track[0].name,
						output = artist + " - " + song;
					var lastfm_latest = $.getIniDbString('lastfmSettings', 'latest'),
						attr = json.recenttracks.track[0]['@attr'];

					if (attr) {
						live = json.recenttracks.track[0]['@attr'].nowplaying;
					}
			
					if (lastfm_latest != output && live) {
						$.consoleDebug("Running LastFM Update..."); //This is only here for bug fixing
						if(lastfm_announce) {// Announces song to chat
							$.say($.lang.get('lastfm.latest.song.auto', output));
						}
						if(overwrite_youtube) {// Writes to the Youtube player's song file (For OBS and stuff).
							$.writeToFile(output + ' ', youtube_path + 'currentsong.txt', false);
						}
						$.setIniDbString('lastfmSettings', 'latest', output);
					}
				}
			}
		}
    }

    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            //argsString,
            action = args[0],
            action1 = args[1];

        var ranked_sender = $.whisperPrefix($.username.resolve(sender));

        if (command.equalsIgnoreCase('lastfm')) {

            if (!action) {
                // Get JSON and parse stats
                var json = JSON.parse(_getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + lastfm_username + "&api_key=" + lastfm_apikey + "&format=json"));

                // Iterate over stats types and add formatted string to output
                if (json.recenttracks.track[0].artist) {
                    var artist = json.recenttracks.track[0].artist['#text'],
                        song = json.recenttracks.track[0].name,
                        output = artist + " - " + song;

                    $.say($.lang.get('lastfm.latest.song', ranked_sender, output));
                    return;
                }
            } else if (action.equalsIgnoreCase('username')) {
				if(!action1) {
					$.say($.lang.get('lastfm.setting.change.failed', ranked_sender, 'username'));
					return;
				}
				$.setIniDbBoolean('lastfmSettings', 'username', action1);
				$.say($.lang.get('lastfm.setting.changed', ranked_sender, 'username', action1));
				reloadLastFM();
			} else if (action.equalsIgnoreCase('apikey')) {
				if(!action1) {
					$.say($.lang.get('lastfm.setting.change.failed', ranked_sender, 'apikey'));
					return;
				}
				$.setIniDbBoolean('lastfmSettings', 'apikey', action1);
				$.say($.lang.get('lastfm.setting.changed', ranked_sender, 'apikey', '[key hidden]'));
				reloadLastFM();
			} else if (action.equalsIgnoreCase('announce')) {
				lastfm_announce = !lastfm_announce;
				$.setIniDbBoolean('lastfmSettings', 'announce', lastfm_announce);
				$.say($.lang.get('lastfm.setting.changed', ranked_sender, 'announce', lastfm_announce ? 'enabled' : 'disabled'));
				reloadLastFM();
			} else if (action.equalsIgnoreCase('writeyt')) {
				overwrite_youtube = !overwrite_youtube;
				$.setIniDbBoolean('lastfmSettings', 'writeYt', overwrite_youtube);
				$.say($.lang.get('lastfm.setting.changed', ranked_sender, 'write file', overwrite_youtube ? 'enabled' : 'disabled'));
				reloadLastFM();
			}
        }
    });

    $.bind('initReady', function() {
		if($.bot.isModuleEnabled('./custom/systems/lastFMSystem.js')){
			$.registerChatCommand('./custom/systems/lastFMSystem.js', 'lastfm', 6);
			$.registerChatSubcommand('lastfm', 'username', 1);
			$.registerChatSubcommand('lastfm', 'apikey', 1);
			$.registerChatSubcommand('lastfm', 'writeyt', 1);
			$.registerChatSubcommand('lastfm', 'announce', 1);
		}
    });

    setTimeout(function() {
		setInterval(function() { checkNextsong(); }, 5e3, 'scripts::custom::systems::lastFMSystem.js');
    }, 5e3);

    $.reloadLastFM = reloadLastFM;
})();