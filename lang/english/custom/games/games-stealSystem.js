 /**
 * games-stealSystem.js
 *
 * Language file for stealSystem.js
 *
 * A command that will let you steal another users points.
 *
 * Current version 1.0.0
 * 
 * Original author: Dakoda
 * 
 * Contributors:
 * Wildwolf_live
 *
 */

//No Points Message
$.lang.register('steal.user.nopoints', 'looks like $1 doesnt currently have enough $2');
$.lang.register('steal.nouser.usage', '$1 is not a valid viewer! (try without the @)');

//Starter messages
$.lang.register('steal.sender.steals.loaded', 'Found $1 sender steals.');
$.lang.register('steal.target.steals.loaded', 'Found $1 target steals.');
$.lang.register('steal.tryme', 'tries and steals points $1 from $2.');

//Stolen messages
$.lang.register('steal.sender.steals.1', 'successfully stole $1 from $2.');

$.lang.register('steal.target.steals.1', 'failed to steal $1 from $2.');

 /*
 * Rules on writing your own steal outcomes:
 *
 * - Outcomes are automatically loaded from this file by their sequence number (steal.sender.steals.[This number]) or (steal.target.steals.[This number]).
 * - Keep the format of your outcomes as shown above.
 * - There can be an unlimited number of outcomes, IF you keep their subsequence numbers 1, 2, 3, 4, 5...
 * - Outcomes are picked at random.
 * 
 */

//Settings messages
$.lang.register('steal.min.usage', 'Usage: !steal min [min number]');
$.lang.register('steal.min.success', 'Minimum to steal has been set to $1');
$.lang.register('steal.max.usage', 'Usage: !steal max [max number]');
$.lang.register('steal.max.success', 'Maximum to steal has been set to $1');

