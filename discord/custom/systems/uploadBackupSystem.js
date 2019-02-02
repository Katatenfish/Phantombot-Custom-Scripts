/**
 * uploadBackupSystem.js
 *
 * Command handler to upload a backup of the database to discord.
 */
(function() {
    var channelName = $.getSetIniDbString('database_backup', 'postTo', 'backups'),
        latestBackup = $.getSetIniDbString('database_backup', 'latestBackup', 'latest');

    /**
     * @function reloadGoingLive
     */
    function reloadLatestBackup () {
        channelName = $.getIniDbString('database_backup', 'postTo');
    }

    function getLatestBackup() {
        var newFile,
            newestBackup;

        var files = $.findFiles('./dbbackup/','db');

        for (var i=0;i<files.length;i++)
        {
            newFile = files[i].split(" ");
        }
        newestBackup = newFile[0];
        latestBackup = $.getIniDbString('database_backup', 'latestBackup');
        $.consoleDebug("Running Backup: " + newestBackup); // This is here for debugging only
        if (latestBackup != newestBackup) {
            date = new Date().toUTCString();
            $.discordAPI.sendFile(channelName, 'Backup for ' + date, '.././dbbackup/' + newestBackup);
            $.setIniDbString('database_backup', 'latestBackup', newestBackup);
        }
    }

    /**
     * @event command
     */
    $.bind('discordChannelCommand', function(event) {
        var channel = event.getChannel(),
            command = event.getCommand(),
            sender = event.getMention(),
            argsString,
            arguments = event.getArguments(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('autobackup')) {
            if (!action) {
                $.discord.say(channel, $.lang.get('autobackup.useage', sender));
            } else {
                if (action.equalsIgnoreCase('channel')) {
                    if (!subAction) {
                        $.discord.say(channel, $.lang.get('autobackup.useage', sender));
                    } else {
                        $.setIniDbString('database_backup', 'postTo', subAction);
                        $.discord.say(channel, $.lang.get('autobackup.pass', sender, subAction));
                        reloadLatestBackup();
                    }
                } 
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        $.discord.registerCommand('./discord/custom/systems/uploadBackupSystem.js', 'autobackup', 1);

        setInterval(function() { getLatestBackup(); }, 5e3, 'scripts::discord::custom::systems::uploadBackupSystem.js');
    });
})();