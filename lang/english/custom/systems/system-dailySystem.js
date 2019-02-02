/**
 * dailySystem.js
 *
 * Language file for dailySystem.js
 *
 * Current version 1.1.0
 *
 * Original author: Dakoda
 *
 * Contributors:
 * ImChrisP
 *
 */

/**
 * Main daily strings
 */
$.lang.register('dailysystem.daily.usage', 'Usage: !$1 [ undefined | set ]');
$.lang.register('dailysystem.daily.offline', '!$1 can only be used while $2 is live!');
$.lang.register('dailysystem.daily.payout', 'You have successfully collected you daily pay of $1! You may try again tomorrow to aim for a bigger payout.');
$.lang.register('dailysystem.daily.cooldown', 'Looks like you may have already collected your payout today. You may try again tomorrow to aim for a bigger payout');

/**
 * daily set strings
 */
//main command for setting the varables.
$.lang.register('dailysystem.set.usage','Usage: !$1 set [ UserGroupId | baseCommand ]');
$.lang.register('dailysystem.set.usage.pointsystem','daily can\'t be set, because module "$1" isn\'t enabled.');
//set daily .
$.lang.register('dailysystem.set.usage','Usage: !$1 set <UserGroupId> <MinNumber> <MaxNumber>. Current setting: Min: $2, Max: $3.');
$.lang.register('dailysystem.set.success','$1 Payout has been successfully set to Min: $2, Max: $3.');
$.lang.register('dailysystem.set.fail','$1 is not a valid UserGroupId!');
//set Base Command.
$.lang.register('dailysystem.set.basecommand.usage','Usage: !$1 set baseCommand <string>. Sets the base Command. WARNING! Changing the basecommand will reset permissions!');
$.lang.register('dailysystem.set.basecommand.success','baseCommand has been successfully set to !$1.');
$.lang.register('dailysystem.set.basecommand.failed','baseCommand cannot be set to !$1, because that command already exists!');