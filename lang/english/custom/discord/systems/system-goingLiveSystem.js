/**
 * system-goingLiveSystem.js
 *
 * This will post a live message for each user in the list
 *
 * Current version 1.3.0
 *
 * Original author: Dakoda
 *
 * Contributors:
 * UsernamesSuck
 */

// Going Live Language
$.lang.register('goinglive.useage', '$1, Useage: !goinglive toggle, add, remove, list.');
$.lang.register('goinglive.add.useage', '$1, Useage: !goinglive add [user].');
$.lang.register('goinglive.remove.useage', '$1, Useage: !goinglive remove [type].');
$.lang.register('goinglive.channel.useage', '$1, Useage: !goinglive channel [channel].');

$.lang.register('goinglive.toggle.setting.pass', '$1, $2 toggle has been set to $3.');
$.lang.register('goinglive.toggle.setting.fail', '$1, $2 toggle could not be toggled');

$.lang.register('goinglive.user.add.pass', '$1, $2 has been added to the streamer list.');
$.lang.register('goinglive.user.add.fail', '$1, $2 is already in the list.');

$.lang.register('goinglive.user.remove.pass', '$1, $2 has been removed from the streamer list.');
$.lang.register('goinglive.user.remove.fail', '$1, $2 in not in the list to be removed.');

$.lang.register('goinglive.channel.pass', '$1, Going live messages will now be posted to $2.');

$.lang.register('goinglive.list.pass', '$1, Going Live list: $2.');

$.lang.register('goinglive.useage', '$1, Useage: !goinglive toggle, add, remove, list.');

//Auto Host Language
$.lang.register('autohost.useage', '$1, Useage: !autohost toggle, add or queue.');
$.lang.register('autohost.add.useage', '$1, Useage: !autohost add [user].');

$.lang.register('autohost.toggle.setting.pass', '$1, $2 toggle has been set to $3.');
$.lang.register('autohost.toggle.setting.fail', '$1, $2 toggle could not be toggled');

$.lang.register('autohost.user.add.pass', '$1, $2 has been added to the autohost list.');

$.lang.register('autohost.queue.pass', '$1, Hosting queue: $2.');
$.lang.register('autohost.queue.fail', '$1, Hosting queue is currently empty.');

// this will just add to the streamhandler
$.lang.register('discord.streamhandler.common.link', '$1 has gone live.');
$.lang.register('discord.streamhandler.common.viewers', 'Viewers');