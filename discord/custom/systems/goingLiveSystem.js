//  /**
//  * goingLiveSystem.js
//  *
//  * This will post a live message for each user in the list
//  *
//  * Current version 1.3.0
//  *
//  * Original author: Dakoda
//  *
//  * Contributors:
//  * UsernamesSuck
//  */
// (function() {
//     var channelName = $.getSetIniDbString('goinglive_config', 'postTo', 'going-live'),
//         autoHostQueue = new java.util.concurrent.ConcurrentLinkedQueue,
//         enabledGoingLive = $.getSetIniDbBoolean('goinglive_config', 'goinglive', true);
//         enabledAutoHost = $.getSetIniDbBoolean('autoHostSettings', 'autohost', true);

//     /**
//      * @function reloadGoingLive
//      */
//     function reloadGoingLive () {
//         channelName = $.getIniDbString('goinglive_config', 'postTo');
//         enabledGoingLive = $.getIniDbBoolean('goinglive_config', 'goinglive');
//     }

//     /**
//      * @function reloadAutoHost
//      */
//     function reloadAutoHost () {
//         enabledAutoHost = $.getIniDbBoolean('autoHostSettings', 'autohost');
//     }

//     /**
//      * @function doRunCheck
//      */
//     function doRunCheck () {
//         if (enabledGoingLive === true) {
//             doGoingLive();
//             $.consoleDebug("Running GoingLive Check"); // This is here for debugging only
//         }
//         if (!$.isOnline($.channelName)) {
//             if (enabledAutoHost == 'true') {
//                 doAutoHost();
//             }
//         }
//     }

//     /**
//      * @function doGoingLive
//      *
//      * Performs the going Live of a Twitch Channel thats listed.
//      */
//     function doGoingLive() {
//         var liveList = $.inidb.GetKeyList('goinglive_channels', '');

//         if (enabledGoingLive === true) {
//             for (var i in liveList) {

//                 if ($.isOnline(liveList[i])) {
//                     var channelToGoLive = liveList[i];
//                     var enabledChannel = $.getIniDbBoolean('goinglive_channels', channelToGoLive);
//                     if (!enabledChannel) {
//                         if ($.isOnline(channelToGoLive)) {
//                             $.setIniDbBoolean('goinglive_channels', channelToGoLive, true);
//                             sendGoingLive(channelToGoLive);
//                         }
//                     }
//                 } else {
//                     var channelToGoLive = liveList[i];
//                     var enabledChannel = $.getIniDbBoolean('goinglive_channels', channelToGoLive);
//                     if (enabledChannel) {
//                         if (!$.isOnline(channelToGoLive)) {
//                             $.setIniDbBoolean('goinglive_channels', channelToGoLive, false);
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     /**
//      * @function doAutoHost
//      *
//      * Performs the auto host for the next user in line.
//      */
//     function doAutoHost() {
//         if (enabledAutoHost === true) {
//             if (!autoHostQueue.isEmpty()) {
//                 var currentUnixTime = parseInt(Math.floor(Date.now() / 1000)),
//                     latestUnixTime = parseInt($.getSetIniDbString('autoHostSettings', "latestTime", currentUnixTime)) + 7.2e3;
                
//                 var hostingListPost = '',
//                     hostingList = autoHostQueue.toArray();

//                 for (i = 0; i < hostingList.length; i++) {
//                     if (!$.isOnline(hostingList[i])) {
//                         autoHostQueue.remove(hostingList[i]);
//                         $.consoleDebug(">> Running Autohost removal: " + hostingList[i]);
//                     }
//                 }

//                 if (currentUnixTime >= latestUnixTime) {
//                     var channelToGoAutoHost = autoHostQueue.poll();
//                     var latestUser = $.getSetIniDbString('autoHostSettings', "latestUser", channelToGoAutoHost);

//                     if (latestUser != channelToGoAutoHost) {
//                         if(!$.isOnline($.channelName) && $.isOnline(channelToGoAutoHost)) {
//                             $.session.sayNow('.host ' + channelToGoAutoHost);
//                             $.consoleDebug(">> Running Autohost poll: " + channelToGoAutoHost);
//                             $.setIniDbString('autoHostSettings', "latestUser", channelToGoAutoHost);
//                             $.setIniDbString('autoHostSettings', "latestTime", currentUnixTime);
//                             autoHostQueue.add(channelToGoAutoHost);
//                         }
//                     } else {
//                         if($.isOnline(channelToGoAutoHost)) {
//                             autoHostQueue.add(channelToGoAutoHost);
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     /**
//      * @function getStreamerList
//      *
//      * this will pull a list of users from goinglive
//      */
//     function getStreamerList() {
//         var streamerListPost = '';
//         var streamerList = $.inidb.GetKeyList('goinglive_channels', '');

//         for (i = 0; i < streamerList.length; i++) {
//             if (i >= 1) {
//                 streamerListPost += ', ';
//             }
//             streamerListPost += i + '. ' + streamerList[i];
//         }

//         return streamerListPost;
//     }

//     /**
//      * @function getHostingQueue
//      *
//      * this will pull a list of users from hosting queue
//      */
//     function getHostingQueue(sender, channel) {
//         var hostingListPost = '',
//             hostingList = autoHostQueue.toArray();

//         if (!autoHostQueue.isEmpty()) {
//             for (i = 0; i < hostingList.length; i++) {
//                 if (i >= 1) {
//                     hostingListPost += ', ';
//                 }
//                 hostingListPost += i + '. ' + hostingList[i];
//             }
//             $.discord.say(channel, $.lang.get('autohost.queue.pass', sender, hostingListPost));
//         } else {
//             $.discord.say(channel, $.lang.get('autohost.queue.fail', sender));  
//         }
//     }

//     /**
//      * @function doGoingLive
//      *
//      * Performs the going Live push embed to discord.
//      */
//     function sendGoingLive(channelToGoLive) {
//         setTimeout(function() {
//             var enabledChannel = $.getIniDbBoolean('goinglive_channels', channelToGoLive);
//             if ($.isOnline(channelToGoLive) && enabledChannel) {
//                 $.consoleDebug(">> Running (ONLINE) Going Live Update For " + channelToGoLive);
//                 autoHostQueue.add(channelToGoLive);
        
//                 $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
//                     .withColor(100, 65, 164)
//                     .withThumbnail($.getLogo(channelToGoLive))
//                     .withTitle($.lang.get('discord.streamhandler.common.link', $.username.resolve(channelToGoLive)))
//                     .appendField($.lang.get('discord.streamhandler.common.game'), $.getGame(channelToGoLive), true)
//                     .appendField($.lang.get('discord.streamhandler.common.title'), $.getStatus(channelToGoLive), true)
//                     .appendField($.lang.get('discord.streamhandler.common.uptime'), $.getStreamUptime(channelToGoLive).toString(), true)
//                     .appendField($.lang.get('discord.streamhandler.common.viewers'), $.getViewers(channelToGoLive), true)
//                     .withTimestamp(Date.now())
//                     .withFooterText('Twitch')
//                     .withFooterIcon($.getLogo(channelToGoLive))
//                     .withUrl('https://twitch.tv/' + channelToGoLive)
//                     .build());
//             }
//         }, 5e2);
//     }

//     $.bind('discordChannelCommand', function(event) {
//         var channel = event.getChannel(),
//             command = event.getCommand(),
//             sender = event.getMention(),
//             arguments = event.getArguments(),
//             args = event.getArgs(),
//             argsString,
//             arguments = event.getArguments(),
//             args = event.getArgs(),
//             action = args[0],
//             subAction = args[1];


//         if (command.equalsIgnoreCase('goinglive')) {
//             if (!action) {
//                 $.discord.say(channel, $.lang.get('goinglive.useage', sender));
//             } else {
//                 if (action.equalsIgnoreCase('toggle')) {
//                     if (enabledGoingLive === null) {
//                         $.discord.say(channel, $.lang.get('goinglive.toggle.setting.fail', sender, 'goinglive'));
//                     } else {
//                     	enabledGoingLive = !enabledGoingLive;
//                     	$.inidb.set('goinglive_config', 'goinglive', enabledGoingLive);
//                     	$.discord.say(channel, $.lang.get('goinglive.toggle.setting.pass', sender, 'goinglive', (enabledGoingLive === true ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
//                     }
//                 } else if (action.equalsIgnoreCase('add')) {
//                     if (!subAction) {
//                         $.discord.say(channel, $.lang.get('goinglive.add.useage', sender));
//                     } else {
//                         var enabledChannel = $.inidb.get('goinglive_channels', subAction);
//                         if (enabledChannel === null) {
//                             $.setIniDbBoolean('goinglive_channels', subAction, false);
//                             $.discord.say(channel, $.lang.get('goinglive.user.add.pass', sender, subAction));
//                         } else {
//                             $.discord.say(channel, $.lang.get('goinglive.user.add.fail', sender, subAction));
//                         }
//                     }
//                 } else if (action.equalsIgnoreCase('remove')) {
//                     if (!subAction) {
//                         $.discord.say(channel, $.lang.get('goinglive.remove.useage', sender));
//                     } else {
//                         var enabledChannel = $.inidb.get('goinglive_channels', subAction);
//                         if (enabledChannel === null) {
//                             $.discord.say(channel, $.lang.get('goinglive.user.remove.fail', sender, subAction));
//                         } else {
//                             $.inidb.del('goinglive_channels', subAction);
//                             $.discord.say(channel, $.lang.get('goinglive.user.remove.pass', sender, subAction));
//                         }
//                     }
//                 } else if (action.equalsIgnoreCase('channel')) {
//                     if (!subAction) {
//                         $.discord.say(channel, $.lang.get('goinglive.channel.useage', sender));
//                     } else {
//                         $.setIniDbString('goinglive_config', 'postTo', subAction);
//                         $.discord.say(channel, $.lang.get('goinglive.channel.pass', sender, subAction));
//                         reloadGoingLive();
//                     }
//                 } else if (action.equalsIgnoreCase('list')) {
//                     $.discord.say(channel, $.lang.get('goinglive.list.pass', sender, getStreamerList()));
//                 } else {
//                     $.discord.say(channel, $.lang.get('goinglive.useage', sender));
//                 }
//             }
         
//         }

//         if (command.equalsIgnoreCase('autohost')) {
//             if (!action) {
//                 $.discord.say(channel, $.lang.get('autohost.useage', sender));
//             } else {
//                 if (action.equalsIgnoreCase('toggle')) {
//                     if (enabledAutoHost === null) {
//                         $.discord.say(channel, $.lang.get('autohost.toggle.setting.fail', sender, 'autohost'));
//                     } else {
//                     	enabledAutoHost = !enabledAutoHost;
//                     	$.inidb.set('autoHostSettings', 'autohost', enabledAutoHost);
//                     	$.discord.say(channel, $.lang.get('autohost.toggle.setting.pass', sender, 'goinglive', (enabledAutoHost === true ? $.lang.get('common.enabled') : $.lang.get('common.disabled'))));
//                     }
//                 } else if (action.equalsIgnoreCase('queue')) {
//                     getHostingQueue(sender, channel);
//                 } else if (action.equalsIgnoreCase('add')) {
//                     if (!subAction) {
//                         $.discord.say(channel, $.lang.get('autohost.add.useage', sender));
//                     } else {
//                         autoHostQueue.add(subAction);
//                         $.discord.say(channel, $.lang.get('autohost.user.add.pass', sender, subAction));
//                     }
//                 } else {
//                     $.discord.say(channel, $.lang.get('autohost.useage', sender));
//                 }
//             }
//         }


//     });

//     $.bind('initReady', function() {
//         $.discord.registerCommand('./discord/custom/systems/goingLiveSystem.js', 'goinglive', 1);
//         $.discord.registerSubCommand('goinglive', 'toggle', 1);
//         $.discord.registerSubCommand('goinglive', 'add', 1);
//         $.discord.registerSubCommand('goinglive', 'remove', 1);
//         $.discord.registerSubCommand('goinglive', 'list', 1);
//         $.discord.registerCommand('./discord/custom/systems/goingLiveSystem.js', 'autohost', 1);
//         $.discord.registerSubCommand('autohost', 'toggle', 1);
//         $.discord.registerSubCommand('autohost', 'queue', 1);
//         $.discord.registerSubCommand('autohost', 'add', 1);

//         setTimeout(function() {
//             setInterval(function() { doRunCheck(); }, 5e3, 'scripts::discord::custom::systems::goingLiveSystem.js');
//         }, 5e3);
//     });

//     $.reloadGoingLive = reloadGoingLive;
//     $.reloadAutoHost = reloadAutoHost;
// })();