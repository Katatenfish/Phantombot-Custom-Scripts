/**
 * gtCommand.js
 *
 * Command handler to say a custom gamertag based on the current game.
 * Add new game definitions to the getGamertag switch statement.
 */
(function() {

    function getGamertag(game) {
        switch (game) {
            case "Grand Theft Auto V":
                return "A cool name";
            case "Destiny":
                return "Another cool name";
            default: // Default means if the string game does not match any of the existing cases. keep this.
                return "Another name";
        }
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var //sender = event.getSender(),
            command = event.getCommand(),
            //args = event.getArgs(),
            //argsString,
            //action = args[0],
            game = $.getGame($.channelName);

        if (command.equalsIgnoreCase('gt')) {
            $.say('My gamertag is ' + getGamertag(game));
            return;
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/commands/gtCommand.js')){
            $.registerChatCommand('./custom/commands/gtCommand.js', 'gt', 2);
        }
    });
})();