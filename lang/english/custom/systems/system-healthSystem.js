/**
 * systems-healthSystem.js
 *
 * Language file for healthSystem.js
 *
 * Current version 1.0.4
 * https://community.phantombot.tv/t/wellness-feature-then-some/3931
 *
 * Original author: Dakoda
 *
 * Contributors:
 * ShadowDragon7015, Khryztoepher, BantomPhot
 *
 *
 */

/**
 * Main health strings
 */
$.lang.register('healthsystem.health.usage', 'Usage: !$1 [ hydration | hunger | movement | sleep | wellbeing | toggle ]');
$.lang.register('healthsystem.health.offline', '!$1 $2 can only be used when $3 is live!');

/**
 * Settings health strings
 */
// usage strings
$.lang.register('healthsystem.settings.usage', 'Usage: !$1 [ set | check ]');
$.lang.register('healthsystem.settings.usage.set', 'Usage: !$1 set [ hydration | hunger | movement | sleep | wellbeing ]');
$.lang.register('healthsystem.settings.usage.set.hydration', 'Usage: !$1 set hydration [ oz | timer ] <int>');
$.lang.register('healthsystem.settings.usage.set.hunger', 'Usage: !$1 set hunger [ timer ] <int>');
$.lang.register('healthsystem.settings.usage.set.movement', 'Usage: !$1 set movement [ timer ] <int>');
$.lang.register('healthsystem.settings.usage.set.sleep', 'Usage: !$1 set sleep [ timer ] <int>');
$.lang.register('healthsystem.settings.usage.set.wellbeing', 'Usage: !$1 set wellbeing [ timer ] <int>');
// check strings
$.lang.register('healthsystem.settings.check.usage', 'Usage: !$1 check [ hydration | hunger | movement | sleep | wellbeing ]');
$.lang.register('healthsystem.settings.check.hydration', '$1 settings set to: HydrationOZ: $2 HydrationTimer: $3 HydrationToggle: $4');
$.lang.register('healthsystem.settings.check.hunger', '$1 settings set to: HungerTimer: $2 HungerToggle: $3');
$.lang.register('healthsystem.settings.check.movement', '$1 settings set to: MovementTimer: $2 MovementToggle: $3');
$.lang.register('healthsystem.settings.check.sleep', '$1 settings set to: SleepTimer: $2 SleepToggle: $3');
$.lang.register('healthsystem.settings.check.wellbeing', '$1 settings set to: WellbeingTimer: $2 WellbeingToggle: $3');

/**
 * Hydration  strings
 */
$.lang.register('healthsystem.hydration.reminder', 'You\'ve been live for just over $1. By this point in your broadcast you should have consumed at least $2oz ($3mL) of water/H2O to maintain optimum hydration.');
$.lang.register('healthsystem.hydration.command', '$1 has been live for just over $2. By this point in they’re broadcast you should have consumed at least $3oz ($4mL) of water/H2O to maintain optimum hydration.');

/**
 * Hunger  strings
 */
$.lang.register('healthsystem.hunger.reminder', 'You\'ve been live for just over $1, this is a reminder that you should take a break for food.');
$.lang.register('healthsystem.hunger.command', '$1 has been live for just over $2, and should take a break for food in $3 minutes.');

/**
 * Movement  strings
 */
$.lang.register('healthsystem.movement.reminder', 'You\'ve been live for just over $1, this is a reminder that you should take a break and move/stretch.');
$.lang.register('healthsystem.movement.command', '$1 has been live for just over $2, and should take a break in $3 minutes.');

/**
 * Sleep  strings
 */
$.lang.register('healthsystem.sleep.reminder', 'You\'ve been live for just over $1, this is a reminder that you should take nap.');
$.lang.register('healthsystem.sleep.command', '$1 has been live for just over $2, and should take a nap in $3 minutes.');

/**
 * Wellbeing  strings
 */
// reminder messages
$.lang.register('healthsystem.wellbeing.reminder.loaded', 'Found $1 Wellbeing Reminders.');
$.lang.register('healthsystem.wellbeing.reminder.1', 'Just want to remind you how much I appreciate you & ALL that you do here!');
$.lang.register('healthsystem.wellbeing.reminder.2', 'In every day, there are 1,440 minutes. That means WE have 1,440 daily opportunities to make a positive impact.');
$.lang.register('healthsystem.wellbeing.reminder.3', 'If I could hug you, I so would. SOMEONE hug them now!');
$.lang.register('healthsystem.wellbeing.reminder.4', 'Remember, you are ONLY human, not perfect. And I\'ll love you either way!');
$.lang.register('healthsystem.wellbeing.reminder.5', '"Yesterday is gone. Tomorrow has NOT yet come. We have only today. Let us begin."-Mother Teresa');
$.lang.register('healthsystem.wellbeing.reminder.6', 'Being positive is better then thinking negative!');

// command messages
$.lang.register('healthsystem.wellbeing.command.loaded', 'Found $1 Wellbeing Commands.');
$.lang.register('healthsystem.wellbeing.command.1', 'Life isn\'t about waiting for the storm to pass. It\'s about learning to dance in the rain.');
$.lang.register('healthsystem.wellbeing.command.2', 'We should be thankful for struggles, because without it WE wouldn\'t have stumbled across our strength.');
$.lang.register('healthsystem.wellbeing.command.3', 'Believe YOU can & you\'re halfway there!');
$.lang.register('healthsystem.wellbeing.command.4', 'Beautiful things happen when you distance yourself from the negative.');
$.lang.register('healthsystem.wellbeing.command.5', 'One small positive thought when you wake up can change your whole day.');
$.lang.register('healthsystem.wellbeing.command.6', 'Life is tough, but you are tougher.');
$.lang.register('healthsystem.wellbeing.command.7', 'We never lose. Either we win or we learn.');
$.lang.register('healthsystem.wellbeing.command.8', 'Beauty begins the moment you decide to be yourself.');
$.lang.register('healthsystem.wellbeing.command.9', 'Life goes by too quickly. So laugh, love and try new things. Forgive, forget and don\'t hold grudges. Choose Happiness!');


/**
 * health toggle strings
 */
$.lang.register('healthsystem.toggle.usage', 'Usage: !$1 toggle [ hydration | hunger | movement | sleep | wellbeing ].');
$.lang.register('healthsystem.toggle.setting.pass', '$1 has been set to $2.');
$.lang.register('healthsystem.toggle.setting.fail', '$1 toggle not found.');

/**
 * health set strings
 */
$.lang.register('healthsystem.settings.set.hydration','$2 settings have been changed to Hydration $3: $4');
$.lang.register('healthsystem.settings.set.hunger','$2 settings have been changed to Hunger $3: $4');
$.lang.register('healthsystem.settings.set.movement','$2 settings have been changed to Movement $3: $4');
$.lang.register('healthsystem.settings.set.sleep','$2 settings have been changed to Sleep $3: $4');
$.lang.register('healthsystem.settings.set.wellbeing','$2 settings have been changed to Wellbeing $3: $4');