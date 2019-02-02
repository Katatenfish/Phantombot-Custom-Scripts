$.lang.register('heistsystem.heist.usage', 'Usage: !heist [$1].');
$.lang.register('heistsystem.alreadyjoined', 'You have already joined the heist!');
$.lang.register('heistsystem.completed', 'The heist ended! Survivors are: $1.');
$.lang.register('heistsystem.completed.no.win', 'The heist ended! There are no survivors.');
$.lang.register('heistsystem.completed.win.total', 'The heist ended with $1 survivor(s) and $2 death(s).');
$.lang.register('heistsystem.join.bettoohigh', 'You can not join with $1, the maximum is $2.');
$.lang.register('heistsystem.join.bettoolow', 'You can not join with $1, the minimum is $2.');
$.lang.register('heistsystem.join.needpoints', 'You can not join with $1, you only have $2.');
$.lang.register('heistsystem.join.notpossible', 'You can not join now.');
$.lang.register('heistsystem.join.success', 'You have joined the heist with $1!');
$.lang.register('heistsystem.loaded', 'Loaded heist stories (found $1).');
$.lang.register('heistsystem.payoutwhisper', 'Adventure completed, $1 + $2 has been added to your balance.');
$.lang.register('heistsystem.runstory', 'Starting heist "$1" with $2 player(s).');
$.lang.register('heistsystem.set.success', 'Set $1 to $2.');
$.lang.register('heistsystem.set.usage', 'Usage: !heist set [settingname] [value].');
$.lang.register('heistsystem.start.success', '$1 is trying get a team together for some serious heist business! Use "!heist [$2]" to join in!');
$.lang.register('heistsystem.tamagotchijoined', '$1 is also joining the heist.');
$.lang.register('heistsystem.top5', 'The top 5 heisters are: $1.');
$.lang.register('heistsystem.top5.empty', 'There haven\'t been any heist winners recorded yet.');
$.lang.register('heistsystem.reset', 'The heist has now cooled off! Use "!heist [$1]" to start a new heist!');


$.lang.register('heistsystem.stories.1.title', 'Time Heist');
$.lang.register('heistsystem.stories.1.difficulty', 10);
$.lang.register('heistsystem.stories.1.chapter.1', 'Your memory is vague, on the table a small laptop is playing a video: "My name is The Architect. The bank of Karabraxos is the most secure bank in the universe. You will rob the bank of Karabraxos!"');
$.lang.register('heistsystem.stories.1.chapter.2', 'Unable to leave their minds blank, (caught) slowly feel their mind being drained as The Teller feeds on their thoughts.');
$.lang.register('heistsystem.stories.1.chapter.3', 'We find ourselves back in the room we started in as consciousness of (survivors) slowly fades again, only to wake up in our beds like nothing at all has happened.');

$.lang.register('heistsystem.stories.2.title', 'Beartraps');
$.lang.register('heistsystem.stories.2.difficulty', 20);
$.lang.register('heistsystem.stories.2.chapter.1', 'Friends! I\'ve got coordinates for a secret stash of bolts, hidden away within the bowels of the elven forest. We should shoe up and give this a go!');
$.lang.register('heistsystem.stories.2.chapter.2', 'Look out, bear traps! (caught) got their legs ripped off!');
$.lang.register('heistsystem.stories.2.chapter.3', 'Dayum, that was a close call for loosing a leg. But you\'ve deserved this (survivors)!');

$.lang.register('heistsystem.stories.3.title', 'Vampires?!');
$.lang.register('heistsystem.stories.3.difficulty', 30);
$.lang.register('heistsystem.stories.3.chapter.1', 'Ah, my dear friends! I may have found the heist of a lifetime. Namely the house of count Dracula is believed to be the bolts master! I\'m for going now!');
$.lang.register('heistsystem.stories.3.chapter.2', 'It\'s him! (caught) got slaughtered violently!');
$.lang.register('heistsystem.stories.3.chapter.3', 'That was a close call, I don\'t think I\'ve been bitten. you? Ow well, (survivors), here\'s your share! ~Transforms into a bat and flutters off~');

$.lang.register('heistsystem.stories.4.title', 'Cereal');
$.lang.register('heistsystem.stories.4.difficulty', 40);
$.lang.register('heistsystem.stories.4.chapter.1', 'I think we have a much bigger thread on our hands than the cave in... It is half man, half bear, half pig... Don\'t Laugh, I\'M SUPER CEREAL!');
$.lang.register('heistsystem.stories.4.chapter.2', 'As the heistrs work their way through the tunnels they hear a soft noise from behind them...');
$.lang.register('heistsystem.stories.4.chapter.3', 'Look out! It\'s ManBearPig! (caught) get dragged of into the darkness.');
$.lang.register('heistsystem.stories.4.chapter.4', '(survivors) run away. Let\'s get out of here guys! We can\'t deal with this alone');


/*
 * Rules on writing your own heist story:
 *
 * - Stories are automatically loaded from this file by their sequence number (heistsystem.stories.[This number]).
 * - Keep the format of your story as shown above.
 * - There can be an unlimited number of stories, IF you keep their subsequence numbers 1, 2, 3, 4, 5...
 * - A story must have a title.
 * - A story can have an unlimited number of chapters, IF you keep their subsequence numbers 1, 2, 3, 4, 5...
 * - Stories are picked at random.
 *
 ** Game specific story how-to. You also need to make sure that you at least have ONE story that doesn't require a specific game.
 ** Please make sure that your story number also follow along. What I mean by that is it needs to start from 1 and go up. Same with the chapters.
 * - Add $.lang.register('heistsystem.stories.NUMBER.game', 'GAME NAME IN LOWER CASE'); on top of the story chapter.

 * Example >
 * $.lang.register('heistsystem.stories.5.game', 'programming');
 * $.lang.register('heistsystem.stories.5.title', 'Talk Shows');
 * $.lang.register('heistsystem.stories.5.chapter.1', 'random story...');
 *
 * Underneath is a template for your first custom story, just remove the preceding slashes.
 */

//$.lang.register('heistsystem.stories.5.title', '');
//$.lang.register('heistsystem.stories.5.chapter.1', '');
//$.lang.register('heistsystem.stories.5.chapter.2', '');
//$.lang.register('heistsystem.stories.5.chapter.3', '');
