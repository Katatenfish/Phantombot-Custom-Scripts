 /**
 * system-alertSystem.js
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
$.lang.register('alert.fail', '$1, Useage: !alert twitter/toggle.');

$.lang.register('alert.twitter.fail', '$1, Useage: !alert twitter [twitch] [twitter].');
$.lang.register('alert.twitter.pass', '$1, You have set @$2 twitter to $3.');

$.lang.register('alert.toggle.fail', '$1, Useage: !alert toggle [type].');
$.lang.register('alert.toggle.pass', '$1, You have set @$2 twitter to $3.');

$.lang.register('alert.retweet.fail', '$1, Useage: !alert retweet [twitch].');
$.lang.register('alert.retweet.pass', '$1, You have tweeted to $2.');

$.lang.register('alert.toggle.setting.pass', '$1, $2 alert has been set to $3.');
$.lang.register('alert.toggle.setting.fail', '$1, $2 is not one of the listed alerts.');

$.lang.register('alert.twitch.post', 'Something is happening on @$1 stream and you\'re missing it! Come and join us at https://twitch.tv/$1');
$.lang.register('alert.twitch.fail', 'Exited host mode.');

$.lang.register('alert.twitter.post', 'Something is happening on @$1 stream well playing $2 and you\'re missing it! Come and join us at https://twitch.tv/$3?$4');