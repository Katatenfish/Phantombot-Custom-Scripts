var listSelf = [
	"Are you trying to flirt with yourself $1? Forever alone!"
];

var listOther = [
    "$1 is winking at $2, what are you up to? ;)",
    "$1 gives the most charming smile at $2, something is going on there!",
    "$1 is flirting with insistance with $2...but $2 doesn\"t seem to give a fuck.",
    "$1 and $2 just kissed! How cute!",
    "$1 waves at $2 and wants to offer a drink! Yes or nay?",
    "$1 is offering flowers to $2! Lovely!",
    "$1 is having a lovely talk with $2, they are having a nice moment I can tell! <3",
    "$1 is trying hard with $2...but I\"m not sure it\"s going anywhere!",
    "$1 offered a drink to $2, I hope you like it! ;)",
    "$2 accepted the drink offered by $1, but is a bit embarassed! :s",
    "$1 just touched $2\"s butt...I\"m not sure it was appreciated!",
    "$1 is caressing $2\"s butt and $2 is winking at $1!",
    "$1 stole a kiss from $2! But got slapped in the face!",
    "$1 is cuddling with $2! How cute!",
    "$1 is using the best pick-up line wiht $2...is it working?",
    "$1 gave $2 a red rose! Love is in the air!",
    "$1 is trying to smile in a sexy way...but $2 is a bit creeped out!",
    "$1 just told the best joke to $2, they are having fun there! <3",
    "$2 is running away because $1 just did the most terrible dance!",
    "$1 is going crazy on the dance floor with $2! Sweet couple!",
    "$1 offered a wedding ring to $2 but got slapped in the face! They\"re not even dating!",
    "$1 is winking at $2 while pointing to the bedroom, but $2 just ran away!",
    "$1 is showing off nice heart panties! But $2 is not impressed!",
    "$1 is doing as stip tease for $2! But fell down and broke a leg!",
    "$1 gave an air kiss to $2 and got one back! <3",
    "$1 is hugging $2 very tenderly!",
    "$1 is doing a magic trick to impress $2! Is it working?",
    "$1 just shot a cupid\"s arrow into $2\"s heart...but it was a real arrow and $2 died! Geez!",
    "$1 is kissing $2 on the hand very gently! How sweet!",
    "$1 and $2 are having a very long and passionate kiss!"
];

var countSelf = 0;
listSelf.forEach(function(item) {
	countSelf++;
	$.lang.register('flirtcommand.self.'+countSelf, item);
});

var countOther = 0;
listOther.forEach(function(item) {
	countOther++;
	$.lang.register('flirtcommand.other.'+countOther, item);
});

$.lang.register('flirtcommand.console.loaded', 'Found flirt command messages: $1 self, $2 other.');
