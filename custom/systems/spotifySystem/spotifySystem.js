/**
 * spotifySystem.js
 *
 * This command will get the lastes song from Spotify.
 *
 * Current version 1.0.2
 *
 * Original author: Alixe
 *
 * Contributors:
 * UsernamesSuck
 */
(function() {
    var spotify_apikey = $.getSetIniDbString('spotifySettings', 'apikey', 'apikey'),
		spotify_latest = $.getSetIniDbString('spotifySettings', 'latest', 'latest'),
		spotify_announce = $.getSetIniDbBoolean('spotifySettings', 'announce', true),
		overwrite_youtube = $.getSetIniDbBoolean('spotifySettings', 'writeYt', false),
		youtube_path = $.getSetIniDbString('ytSettings', 'baseFileOutputPath', './addons/youtubePlayer/');

    /**
     * @function reloadSpotify
     */
    function reloadSpotify() {
        spotify_apikey = $.getIniDbString('spotifySettings', 'apikey');
		spotify_latest = $.getSetIniDbString('spotifySettings', 'latest', 'latest');
        spotify_announce = $.getIniDbBoolean('spotifySettings', 'announce');
		overwrite_youtube = $.getSetIniDbBoolean('spotifySettings', 'writeYt', false);
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
        if($.bot.isModuleEnabled('./custom/systems/spotifySystem.js')){
            if (!spotify_announce && !overwrite_youtube) {
                return;
            }

            if (spotify_apikey == 'apikey') {
                $.say($.lang.get('spotify.error.404', spotify_username , spotify_apikey));
                return;
            }

            try {
                var json = JSON.parse(_getJSON("http://thetwitchapi.site/spotify/song?is_playing=1&refresh_token=" + spotify_apikey));
                if (json.track.artist) {
                    var artist = json.track.artist,
                        song = json.track.song,
                        external_url = json.track.external_url,
                        output = artist + " - " + song + " | " + external_url;
                    var spotify_latest = $.getIniDbString('spotifySettings', 'latest'),
                        is_playing = json.track.is_playing;
    
                    if (spotify_latest != output && is_playing) {
                        $.consoleDebug("Running Spotify Update..."); //This is only here for bug fixing
                        if(spotify_announce) {// Announces song to chat
                            $.say($.lang.get('spotify.latest.song.auto', output));
                        }
                        if(overwrite_youtube) {// Writes to the Youtube player's song file (For OBS and stuff).
                            $.writeToFile(output + ' ', youtube_path + 'currentsong.txt', false);
                        }
                        $.setIniDbString('spotifySettings', 'latest', output);
                    }
                }
            }
            catch(error) {
                $.consoleDebug('Something went wrong with Spotify: ' + error);
            }	
        }
    }

    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            action1 = args[1];

        var ranked_sender = $.whisperPrefix($.username.resolve(sender));

        if (command.equalsIgnoreCase('spotify')) {
            if (!action) {
                // Get JSON and parse stats
                try {
                    var json = JSON.parse(_getJSON("http://thetwitchapi.site/spotify/song?is_playing=1&refresh_token=" + spotify_apikey));
                // Iterate over stats types and add formatted string to output                
                    if (json.track.artist) {
                        var artist = json.track.artist,
                            song = json.track.song,
                            external_url = json.track.external_url,
                            output = artist + " - " + song + " | " + external_url;

                        $.say($.lang.get('spotify.latest.song', ranked_sender, output));
                        return;
                    }
                }
                catch(error) {
                    $.consoleDebug('Something went wrong with Spotify: ' + error);
                }
            } else if (action.equalsIgnoreCase('apikey')) {
				if(!action1) {
					$.say($.lang.get('spotify.setting.change.failed', ranked_sender, 'apikey'));
					return;
				}
				$.setIniDbBoolean('spotifySettings', 'apikey', action1);
				$.say($.lang.get('spotify.setting.changed', ranked_sender, 'apikey', '[key hidden]'));
				reloadSpotify();
			} else if (action.equalsIgnoreCase('announce')) {
				spotify_announce = !spotify_announce;
				$.setIniDbBoolean('spotifySettings', 'announce', spotify_announce);
				$.say($.lang.get('spotify.setting.changed', ranked_sender, 'announce', spotify_announce ? 'enabled' : 'disabled'));
				reloadSpotify();
			} else if (action.equalsIgnoreCase('writeyt')) {
				overwrite_youtube = !overwrite_youtube;
				$.setIniDbBoolean('spotifySettings', 'writeYt', overwrite_youtube);
				$.say($.lang.get('spotify.setting.changed', ranked_sender, 'write file', overwrite_youtube ? 'enabled' : 'disabled'));
				reloadSpotify();
			}
        }
    });

    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/systems/spotifySystem.js')){
            $.registerChatCommand('./custom/systems/spotifySystem.js', 'spotify', 6);
            $.registerChatSubcommand('spotify', 'apikey', 1);
            $.registerChatSubcommand('spotify', 'writeyt', 1);
            $.registerChatSubcommand('spotify', 'announce', 1);
        }
    });

    setTimeout(function() {
		setInterval(function() { checkNextsong(); }, 5e3, 'scripts::custom::systems::spotifySystem.js');
    }, 5e3);

    $.reloadSpotify = reloadSpotify;
})();