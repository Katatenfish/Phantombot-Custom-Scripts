/**
 * system-payactiveSystem.js
 *
 * language file for payActiveSystem.js
 *
 * Current version 1.1.0
 *
 * Original author: Dakoda (https://community.phantombot.tv/t/payactive-command-to-pay-out-active-users/2351)
 *
 * Contributors:
 * ArthurTheLastAncient
 *
 */
 
//Pay Active System language file
$.lang.register('payactive.check.pass', '$1, Pay Active is set to $2.');

$.lang.register('payactive.enabled.pass', '$1, the payactive has been enabled.');
$.lang.register('payactive.disabled.pass', '$1, the payactive has been disabled.');

$.lang.register('payactive.add.pass', '$1, you have been added to the payactive.');

$.lang.register('payactive.paid.pass', 'The payactive has been paid out to $1 active $2.');
$.lang.register('payactive.paid.user', '');

$.lang.register('payactive.active.user', 'The active user was:- $1.');
$.lang.register('payactive.active.users', 'The active users were:- $1.');
$.lang.register('payactive.paid.fail', 'Looks like there have not been any active users during the pay active.');

$.lang.register('payactive.set.payout.usage', '$1, Sets the payout amount. Usage: !payactive set payout <amount>');
$.lang.register('payactive.set.chatmessage.usage', '$1, Enables/disables chat messages. Usage: !payactive set chatmessage <true | false>');
$.lang.register('payactive.set.userentrymessage.usage', '$1, Enables/disables per user entry messages. Usage: !payactive set userentrymessage <true | false>');

$.lang.register('payactive.set.payout.pass', '$1, Pay Active has been set to $2.');
$.lang.register('payactive.set.chatmessage.enabled', '$1, chat messages have been enabled for the payactive system.');
$.lang.register('payactive.set.chatmessage.disabled', '$1, chat messages have been disabled for the payactive system.');
$.lang.register('payactive.set.userentrymessage.enabled', '$1, per user entry messages have been enabled for the payactive system.');
$.lang.register('payactive.set.userentrymessage.disabled', '$1, per user entry messages have been disabled for the payactive system.');
