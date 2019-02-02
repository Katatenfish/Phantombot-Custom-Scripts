/**
 * games-challengeSystem.js
 *
 * Language file for challengeSystem.js
 *
 * Current version 2.1.1
 * 
 * Original author: yxpoh (https://community.phantombot.tv/t/the-challenge-automated-randomized-fighting-chat-game/1529)
 * 
 * Contributors:
 * UsernamesSuck, TheRealAlixe, ArthurTheLastAncient
 *
 */

/**
 * Attack descriptions
 * The numbers need to be sequential in order for them to work correctly.
 * Parameters:
 * $1: {string} Attacker
 * $2: {string} Defender
 * $3: {Number} amount of damage
 */
$.lang.register('challengesystem.attack.1', '$1 slashes $2 with their claws for $3 damage.');
$.lang.register('challengesystem.attack.2', '$1 mauls $2 and did $3 damage.');
$.lang.register('challengesystem.attack.3', '$1 bodyslammed $2 and did $3 damage. That\'s gotta hurt...');
$.lang.register('challengesystem.attack.4', '$1 headbuts $2 for $3 damage.');
$.lang.register('challengesystem.attack.5', 'An artful juke from $1, followed by a punch. $2 takes $3 damage.');
$.lang.register('challengesystem.attack.6', '$1 did something and it caused $3 damage to $2. We\'re not sure what happened there...');
$.lang.register('challengesystem.attack.7', '$1 slams $2 into a tree for $3 damage.');
$.lang.register('challengesystem.attack.8', '$2 tries to stab $1, but $1 parries with a quick jab to the ribs for $3 damage.');
$.lang.register('challengesystem.attack.9', '$1 throws a tree trunk onto $2. Ouch. $3 damage.');
$.lang.register('challengesystem.attack.10', '$2 is confused and tripped. $3 damage to self.');

/**
 * Dodge descriptions
 * The numbers need to be sequential in order for them to work correctly.
 * Parameters:
 * $1: {string} Attacker
 * $2: {string} Defender
 */
$.lang.register('challengesystem.dodge.1', '$1 tried punching $2, but $2 squat to dodge it.');
$.lang.register('challengesystem.dodge.2', '$2 dodge-rolled out of the slash of $1.');
$.lang.register('challengesystem.dodge.3', '$2 sidesteps the charge from $1.');
$.lang.register('challengesystem.dodge.4', '$1 growls ferociously... $2 seems unaffected.');
$.lang.register('challengesystem.dodge.5', '$2 manages to block $1\'s attack somehow.');
$.lang.register('challengesystem.dodge.6', '$1 slips up and misses the attack on $2.');
$.lang.register('challengesystem.dodge.7', '$1 used SPLASH!... But nothing happend');
$.lang.register('challengesystem.dodge.8', '$2 glares dangerously at $1, making them incapable of action.');
$.lang.register('challengesystem.dodge.9', '$1 is thinking about their next move... Then forgot to do anything.');

/**
 * Console output
 */
$.lang.register('challengesystem.console.attacksloaded', 'Found $1 attacks');
$.lang.register('challengesystem.console.dodgesloaded', 'Found $1 dodges');
$.lang.register('challengesystem.console.attackdodgeerror', 'WARNING! There were no Attacks or Dodges found. Current attackMoves: $1, current dodgeMoves: $2');

/**
 * Main challenge strings
 */
$.lang.register('challengesystem.challenge.usage', 'Usage: !$1 <Opponent Name>');
$.lang.register('challengesystem.challenge.noself', 'No, no... it\'s !$1 <OPPONENT>. You can\'t beat yourself up, even if you want to. Sorrynotsorry Kappa');
$.lang.register('challengesystem.challenge.usage.nochallenged', 'You can\'t $1 $2, because they don\'t seem to be in this channel.');
$.lang.register('challengesystem.challenge.usage.nopoints.challenger', 'You don\'t have enough $2 to issue a $1 right now. You need $3.');
$.lang.register('challengesystem.challenge.usage.nopoints.challenged', 'You can\'t $1 $2 right now, because they don\'t have enough $3.');
$.lang.register('challengesystem.challenge.usage.minwager', 'You can\'t $1 with that, because the minimum wager is $2.');
$.lang.register('challengesystem.challenge.usage.maxwager', 'Whoa there, that\'s a lot of $1! The maximum wager for a $2 is $3 though, sorry.');
$.lang.register('challengesystem.challenge.sent','$2 is asking $3 for a $1! Use "!$1 $2" or "!$1 accept" within $4 seconds to accept!');
$.lang.register('challengesystem.challenge.sentself','$2 is asking $3 for a $1! $3 has accepted $2\'s $1... Things are about to get heated up in the Arena!');
$.lang.register('challengesystem.challenge.inprogress', 'There is already a $1 proposal, so please wait for it to expire before proposing again.');
$.lang.register('challengesystem.challenge.noreply', '$2\'s $1 request has expired, because $3 hasn\'t responded. The arena is now free!');
$.lang.register('challengesystem.challenge.refused', '$3 has declined the $1 request from $2. The arena is now free!');
$.lang.register('challengesystem.challenge.start', '$3 has accepted $2\'s $1... Things are about to get heated up in the Arena!');
$.lang.register('challengesystem.challenge.endwager', '$1 Ended! The winner is $2! Congratulations! You\'ve won $3.');
$.lang.register('challengesystem.challenge.endnowager', '$1 Ended! The winner is $2! Congratulations!');
$.lang.register('challengesystem.challenge.cleanup','The arena is now cleaned up and available for new $1!');
$.lang.register('challengesystem.challenge.maxcaptionsreached', 'The dustcloud from the battle became so heavy it obscured the sight of the fight...');
$.lang.register('challengesystem.challenge.recovery.challenger.minutes', 'You\'re still recovering from your last $1. You have to wait at least $2 minutes to try again');
$.lang.register('challengesystem.challenge.recovery.challenger.minute', 'You\'re still recovering from your last $1. You have to wait at least $2 minute to try again');
$.lang.register('challengesystem.challenge.recovery.challenger.seconds', 'You\'re still recovering from your last $1. You have to wait at least $2 seconds to try again');
$.lang.register('challengesystem.challenge.recovery.challenged.minutes', 'You can\'t $1 $2, because they\'re still recovering from their last fight. They need to recover at least $3 more minutes before being able to accept another challenge');
$.lang.register('challengesystem.challenge.recovery.challenged.minute', 'You can\'t $1 $2, because they\'re still recovering from their last fight. They need to recover at least $3 more minute before being able to accept another challenge');
$.lang.register('challengesystem.challenge.recovery.challenged.seconds', 'You can\'t $1 $2, because they\'re still recovering from their last fight. They need to recover at least $3 more seconds before being able to accept another challenge');

/**
 * Challenge set strings
 */
$.lang.register('challengesystem.set.usage','Usage: !$1 set [ mindamage | maxdamage | health | attackrate | wager | minwager | maxwager | timeout | captions | messageinterval | challengeinterval | recovery | baseCommand ]');
$.lang.register('challengesystem.set.mindamage.usage','Usage: !$1 set mindamage <Number>. Current setting: $2.');
$.lang.register('challengesystem.set.mindamage.success','minDamage has been successfully set to $2.');
$.lang.register('challengesystem.set.maxdamage.usage','Usage: !$1 set maxdamage <Number>. Current setting: $2.');
$.lang.register('challengesystem.set.maxdamage.success','maxDamage has been successfully set to $2.');
$.lang.register('challengesystem.set.health.usage','Usage: !$1 set health <Number>. Current setting: $2 HP.');
$.lang.register('challengesystem.set.health.success','health has been successfully set to $2 HP.');
$.lang.register('challengesystem.set.attackrate.usage','Usage: !$1 set attackrate <Percentage>. Current setting: $2%.');
$.lang.register('challengesystem.set.attackrate.success','attackRate has been successfully set to $2%.');
$.lang.register('challengesystem.set.wager.usage','Usage: !$1 set wager <Number>. Current setting: $2.');
$.lang.register('challengesystem.set.wager.success','wager has been successfully set to $2.');
$.lang.register('challengesystem.set.wager.pointsystem','wager can\'t be set, because module "$1" isn\'t enabled.');
$.lang.register('challengesystem.set.minwager.usage','Usage: !$1 set minwager <Number>. Current setting: $2.');
$.lang.register('challengesystem.set.minwager.success','Minimum wager has been successfully set to $2.');
$.lang.register('challengesystem.set.minwager.pointsystem','Minimum wager can\'t be set, because module "$1" isn\'t enabled.');
$.lang.register('challengesystem.set.maxwager.usage','Usage: !$1 set maxwager <Number>. Current setting: $2.');
$.lang.register('challengesystem.set.maxwager.success','Maximum wager has been successfully set to $2.');
$.lang.register('challengesystem.set.maxwager.pointsystem','Maximum wager can\'t be set, because module "$1" isn\'t enabled.');
$.lang.register('challengesystem.set.timeout.usage','Usage: !$1 set timeout <Number>. Current setting: $2 seconds.');
$.lang.register('challengesystem.set.timeout.success','timeout has been successfully set to $2 seconds.');
$.lang.register('challengesystem.set.messageinterval.usage','Usage: !$1 set messageInterval <Number>. Current setting: $2 seconds.');
$.lang.register('challengesystem.set.messageinterval.success','messageInterval has been successfully set to $2 seconds.');
$.lang.register('challengesystem.set.challengeinterval.usage','Usage: !$1 set challengeinterval <Number>. Current setting: $2 seconds.');
$.lang.register('challengesystem.set.challengeinterval.success','challengeinterval has been successfully set to $2 seconds.');
$.lang.register('challengesystem.set.recovery.usage','Usage: !$1 set recovery <Number>. Current setting: $2 minutes.');
$.lang.register('challengesystem.set.recovery.success','recovery has been successfully set to $2 minutes.');
$.lang.register('challengesystem.set.captions.usage','Usage: !$1 set captions <Number>. Set to 0 for results only. Current setting: $2.');
$.lang.register('challengesystem.set.captions.success','captions has been successfully set to $2.');
$.lang.register('challengesystem.set.basecommand.usage','Usage: !$1 set baseCommand <string>. Sets the base Command. WARNING! Changing the basecommand will reset permissions!');
$.lang.register('challengesystem.set.basecommand.success','baseCommand has been successfully set to !$1.');
$.lang.register('challengesystem.set.basecommand.failed','baseCommand cannot be set to !$1, because that command already exists!');

/**
 * Challenge reset strings
 */
$.lang.register('challengesystem.reset.attackdodgeerror', 'WARNING! There were no Attacks or Dodges found. Current attackMoves: $1, current dodgeMoves: $2. Please check the Language file.');
$.lang.register('challengesystem.reset.success','the challengeSystem was reset successfully. There are $1 attackMoves and $2 dodgeMoves loaded.');
