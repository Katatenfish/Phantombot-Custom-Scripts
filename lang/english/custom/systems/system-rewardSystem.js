//redeem main command
$.lang.register('redeem.usage', 'Type "!redeem [#]" in chat, where # corresponds to the reward number you\'d like to redeem. Check out the Rewards: $1');
$.lang.register('redeem.reward.accept', '$1, has redeemed $2 for $3.');
$.lang.register('redeem.reward.decline', '$1, Sorry there is no item to redeem numbered $2.');
$.lang.register('redeem.reward.nocost', '$1, but looks like you dont have enough $2 for $3.');

//redeem add/edit command
$.lang.register('redeem.edit.usage', '$1, Type "!redeem edit [#] [cost] [reward]" in chat, where # corresponds to the reward number you\'d like to edit.');
$.lang.register('redeem.edit.success-new', 'Added new reward $1 for $2 with name: $3');
$.lang.register('redeem.edit.success-update', 'Updated reward $1 for $2 with name: $3');
$.lang.register('redeem.edit.success-deleted', 'Deleted reward $1');

//redeem discord system
$.lang.register('reward.postto.usage', '$1, Type "!redeem channel [channel].');
$.lang.register('reward.postto.announce', '$1, Discord Announcement messages will now be posted to $2.');
$.lang.register('reward.toggle.announce', '$1, Discord Announcement has been set to $3.');
$.lang.register('discord.reward.announce.embedtitle', 'New Redemption!');