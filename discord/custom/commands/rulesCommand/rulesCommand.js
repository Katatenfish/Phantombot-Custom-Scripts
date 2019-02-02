/**
 * rulesCommand.js
 *
 * This command is to set my rules in discord.
 */
(function() {
    var channelName = $.getSetIniDbString('rulesSettings', 'onlineChannel', 'welcome');

    $.bind('discordChannelCommand', function(event) {
        var sender = event.getSender(),
            channel = event.getChannel(),
            command = event.getCommand(),
            mention = event.getMention(),
            arguments = event.getArguments(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];


        if (command.equalsIgnoreCase('rules')) {

            $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                .withColor(170, 91, 190)
                .withThumbnail('http://82.9.213.253:25005/images/welcome.png')
                .withTitle(':desktop: Welcome to the server!')
                .appendField('Thank you all for coming and joining the community.', 'It is greatly apprecited and I love each and everyone of you! \n\rWe as a community pride ourselves on interaction and bringing a positive light to everyone here. \n\rKick off your shoes, sit back and enjoy. \n\rEnjoy your time here and please get in touch with any <@&365977083593097216> or <@&365977085153640461> if you are having a problem.', true)
                .build());

            setTimeout(function(){
                $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                    .withColor(164, 65, 65)
                    .withThumbnail('http://82.9.213.253:25005/images/disclaimer.png')
                    .withTitle(':clap: Our Disclaimer')
                    .appendField('Read the following before you start traveling this Discord server:', 'Change your profile picture, because adds a more personal feel to your profile. \n\rChange your settings that you deemed necessary - especially applying a PTT button for the voice servers. \n\r You should be given the <@&365977088160694277> role within 72 hours of joining the server and linking your twitch to the bot, but if you haven\'t then please send a DM to myself or any of the other <@&365977083593097216> or <@&365977085153640461> in the server.', true)
                    .build());
            },500);

            setTimeout(function(){
                $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                    .withColor(67, 164, 65)
                    .withThumbnail('http://82.9.213.253:25005/images/roles.png')
                    .withTitle(':blue_book: Our Server Roles')
                    .appendField('The following are a list of roles that we use on the server:', '<@&365977083379187723> - "Community Owner" \n<@&365977083593097216> - "Community Admin" \n<@&365977085153640461> - "People of power on Twitch" \n<@&365977085820403712> - "Community Subscribers" \n<@&520747089802690590> - "Community VIP" \n<@&365977087783206914> - "Community Regular" \n<@&365977088160694277> - "Community Viewer" \n <@&418194594363080715> - "Live Streamers" \n<@&183554994908168192> - "Special Streamers" \n<@&366533443485433869> - "Community Bot"', true)
                    .build());
            },1000);

            setTimeout(function(){
                $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                    .withColor(65, 95, 164)
                    .withThumbnail('http://82.9.213.253:25005/images/chat.png')
                    .withTitle(':speech_left: Our Chats')
                    .appendField('The following are a list of chats that we use here on the server:', '<#183552954752696320> - "Welcome chat is where infomation about the server is!" \n<#119180192559267844> - "General chat is where most users will chat with eachother!"  \n<#409754025433759768> - "Greetings chat is where we welcome new members!" \n<#183551693160579072> - "Commands chat is where the bot commands can be ran at! (to keep other chats clear of spam)" \n<#151204639759400961> - "Update chat is where I will post any updates about myself and my channel!" \n<#409754184137703425> - "Notifications chat is where the bot will post updates about my twitch stream!" \n<#409752860146794506> - "This chat is where <@&183554994908168192> can post going live events!" \n<#409753664790593553> - "This channel is for any twitter updates and retweets!" \n<#346808660724416515> - "This channel will auto post clips that are posted in my twitch chat!" \n<#409746586164527114> - "Staff chat well that says it all I guess!" \n<#333624330275651584> - "Moderation logs will be going in here for staff"', true)
                    .build());
            },1500);

            setTimeout(function(){
                $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                    .withColor(164, 156, 65)
                    .withThumbnail('http://82.9.213.253:25005/images/rules.png')
                    .withTitle(':white_check_mark: Our Server Rules')
                    .appendField('Adhere to the following rules in order to achieve the best possible experience:', 'Do not use language that is deemed racist, sexist, homophobic or derogatory. \nAttempt to be helpful and respectful to your fellow members. \nI welcome and respect all of your opinions, so I expect the same in return and to your fellow members. \nDo not post spoilers for anything in the public channels, keep these to private messages if the user requested them. \nDo not advertise anything unless it has been pre-approved. If you are a <@&183554994908168192>  you can post when you go live in the <#409752860146794506>  channel. \nDo not spam this server or use unnecessary caps. \nKeep everything to the English language.', true)
                    .build());
            },2000);

            setTimeout(function(){
                $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                    .withColor(65, 123, 164)
                    .withThumbnail('http://82.9.213.253:25005/images/twitch.png')
                    .withTitle(':link: How to Link To Twitch')
                    .appendField('Please link your account to twitch.. Just Follow these steps here:', 'Step 1. Link your Discord: Type `!account link` into <#183551693160579072>! \n\rStep 2. Follow the message the bot will private message you.', true)
                    .build());
            },2500);

            setTimeout(function(){
                $.discordAPI.sendMessageEmbed(channelName, new Packages.sx.blah.discord.util.EmbedBuilder()
                    .withColor(100, 65, 164)
                    .withThumbnail('http://82.9.213.253:25005/images/twitter.png')
                    .withTitle(':link: How to Link To Twitter')
                    .appendField('Please link your twitter account to twitch.. Just Follow these steps here:', 'Link: `!twitter register [username]` - Register your Twitter for rewards \n\rUnlink: !twitter unregister - Unregister your Twitter', true)
                    .build());
            },3000);            
        }

    });

    $.bind('initReady', function() {
        $.discord.registerCommand('./discord/custom/commands/rulesCommand.js', 'rules', 1);
    });
})();