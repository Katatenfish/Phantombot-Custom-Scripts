 /**
 * commands_est2Command.js
 *
 * Custom script that will look up the rout or payout of the current job for ETS2!
 *
 * Current version 1.1.0
 *
 * Original author: Dakoda
 *
 * Contributors:
 * NeedyPlays
 *
 */

 //useage commands
$.lang.register('est2.useage', '$1, Useage: !ets2 [options]. Current options: route, payout and set.');
$.lang.register('est2.set.useage', '$1, Useage: !ets2 set [options]. Current options: server, address and currency.');
$.lang.register('est2.set.server.useage', '$1, Usage: !ets2 set server [server].');
$.lang.register('est2.set.currency.useage', '$1, Usage: !ets2 set currency [currency].');
$.lang.register('est2.set.address.useage', '$1, Usage: !ets2 set address [ip address].');

//the connection and online checks
$.lang.register('est2.connections.404', '$1, $2 is not currently connected to ETS2.');
$.lang.register('est2.online.404', '$1, $2 has not currently got a job.');
$.lang.register('est2.server.404', '$1, $2 does not seem to have the server running.');
$.lang.register('est2.route.404', '$1, $2 does not seem to have a current job.');

//the optional commands
$.lang.register('est2.route', '$1, $2 is currently driving: From: $3, To: $4. On Server $5.');
$.lang.register('est2.payout', '$1, $2 will receive $3$4 from the current job.');

//the set command
//this is to set the server
$.lang.register('est2.set.server', '$1, Has just set the server to: $2.');

//this is to set the currency
$.lang.register('est2.set.currency', '$1, Has just set the currency to: $2.');

//this is to set the address
$.lang.register('est2.set.address', '$1, Has just set the ip address to: $2.');