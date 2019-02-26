/**
 * tamagotchi.js
 *
 * This module enables users to manage basic needs for their tamagotchi.
 * An API is exported to "$.tamagotchi" for other scripts to utilize.
 */
(function() {
    var //set the variables needed 
        pricing = {
            buyNewTG: $.getSetIniDbNumber('tamagotchi_settings', 'pricingBuyNewTG', 1000),
            buyFood: $.getSetIniDbNumber('tamagotchi_settings', 'pricingBuyFood', 5),
        },
        foodLevelTTLHrs = $.getSetIniDbNumber('tamagotchi_settings', 'foodLevelTTLHrs', 24),
        foodMax = $.getSetIniDbNumber('tamagotchi_settings', 'foodMax', 30),
        baseLevelCap = $.getSetIniDbNumber('tamagotchi_settings', 'generalLevelCap', 100),
        tamagotchiCount = 0,
        defaultAnimals = '';

    /**
     * @function reloadTamagotchiSettings
     */
    function reloadTamagotchiSettings() {
        pricing = {
            buyNewTG: $.getIniDbNumber('tamagotchi_settings', 'pricingBuyNewTG'),
            buyFood: $.getIniDbNumber('tamagotchi_settings', 'pricingBuyFood'),
        },
        foodLevelTTLHrs = $.getIniDbNumber('tamagotchi_settings', 'foodLevelTTLHrs'),
        foodMax = $.getIniDbNumber('tamagotchi_settings', 'foodMax'),
        baseLevelCap = $.getIniDbNumber('tamagotchi_settings', 'generalLevelCap');
    }


    /**
     * @function doRunCheck
     */
    function doRunCheck() {
        pushAnimals();
        loadAnimals();
    }

    /*
     * @function pushAnimals
     * @info Pushes the entire tamagotchi list to the db, it does disable auto commit first to make this process a lot faster.
     */
    function pushAnimals() {
        $.inidb.setAutoCommit(false);
        for (var i = 1; $.lang.exists('tamagotchi.pet.' + i); i++) {
            if (!$.inidb.exists('tamagotchi_pets', i)) { // This will make setting tamagotchi faster since it does not need to write tamagotchi that are already in the db.
                $.inidb.set('tamagotchi_pets', i, $.lang.get('tamagotchi.pet.' + i));
            }
        }
        tamagotchiCount = i;

        $.consoleDebug($.lang.get('tamagotchi.console.loaded.animals', tamagotchiCount));
        $.inidb.setAutoCommit(true);
    }

    /*
     * @function loadAnimals
     * @info Gets a count of all the tamagotchi and stores it in a variable.
     */
    function loadAnimals() {
        var animalsKeys = $.inidb.GetKeyList('tamagotchi_pets', '');

        for (var i in animalsKeys) {
            if (i >= 1) {
                defaultAnimals += ',';
            }
            defaultAnimals += $.inidb.GetString('tamagotchi_pets', '', animalsKeys[i]);
        }
        defaultAnimals = defaultAnimals.split(',');
    }

    /*
     * @function runOneHour
     * @info Gets a count of all the tamagotchi and stores it in a variable.
     */
    function runOneHour() {
        if($.bot.isModuleEnabled('./custom/games/tamagotchi.js')){
            var tgOwners = $.inidb.GetKeyList('tamagotchi', '');
            for (var i in tgOwners) {
                getByOwner(tgOwners[i]).growOneHour().save();
            }       
        } 
    }

    /**
     * @class
     * @description This class holds information about a tamagotchi.
     * @param {string} owner
     * @param {string} type
     * @param {string} name
     * @param {Number} [dob]
     * @param {Number} [foodLevel]
     * @param {Number} [funLevel]
     * @param {Number} [expLevel]
     * @param {Number} [sex]
     */
    function Tamagotchi(owner, type, name, dob, foodLevel, funLevel, expLevel, sex) {
        this.owner = (owner + '').toLowerCase();
        this.type = (type + '').toLowerCase();
        this.name = (name + '');
        this.dob = (isNaN(dob) ? $.systemTime() : dob);
        this.foodLevel = (isNaN(foodLevel) ? 7 : foodLevel);
        this.funLevel = (isNaN(funLevel) ? 3 : funLevel);
        this.expLevel = (isNaN(expLevel) ? 0 : expLevel);
        this.sex = (!isNaN(sex) ? sex : ($.rand(50) > 25 ? 0 : 1));

        /**
         * @function growOneHour
         * @returns {Tamagotchi}
         */
        this.growOneHour = function() {
            var foodDecr = (1 / foodLevelTTLHrs),
                funDecr = (1 / (foodLevelTTLHrs / 2));

            this
                .decrFunLevel(funDecr)
                .decrFoodLevel(foodDecr);

            if (this.foodLevel <= 0) {
                this.kill();
            }

            return this;
        };

        /**
         * @function kill
         * @returns {Tamagotchi}
         */
        this.kill = function () {
            $.inidb.del('tamagotchi', this.owner);
            $.say($.whisperPrefix(this.owner) + $.lang.get('tamagotchi.died', this.name, getTypesString(), $.getPointsString(pricing.buyNewTG)));

            return this;
        };

        /**
         * @function getAgeInSeconds
         * @returns {Number}
         */
        this.getAgeInSeconds = function() {
            return ($.systemTime() - this.dob) / 1000;
        };

        /**
         * @function getSexString
         * @return {string}
         */
        this.getSexString = function(type) {
            switch (type) {
                case "hatch":
                    return $.lang.get((this.sex == 1 ? 'tamagotchi.sex.male' : 'tamagotchi.sex.female'));
                default: // Default means if the string game does not match any of the existing cases. keep this.
                    return $.lang.get((this.sex == 1 ? 'tamagotchi.sex.him' : 'tamagotchi.sex.her'));
            }
        };

        /**
         * @function isHappy
         * @param {boolean} [acceptMeh]
         * @returns {boolean}
         */
        this.isHappy = function(acceptMeh) {
            return (this.funLevel >= (acceptMeh ? 1 : 7));
        };

        /**
         * @function save
         * @returns {Tamagotchi}
         */
        this.save = function() {
            if (this.foodLevel <= 0) {
                return this;
            }

            $.inidb.set('tamagotchi', this.owner, JSON.stringify({
                owner: this.owner,
                type: this.type,
                name: this.name,
                dob: this.dob,
                foodLevel: this.foodLevel,
                funLevel: this.funLevel,
                expLevel: this.expLevel,
                sex: this.sex,
            }));

            return this;
        };

        /**
         * @function incrFoodLevel
         * @param {Number} amount
         * @returns {Tamagotchi}
         */
        this.incrFoodLevel = function(amount) {
            this.foodLevel += amount;
            $.say($.whisperPrefix(this.owner) + $.lang.get('tamagotchi.foodgiven', this.name, amount, $.getTimeString(amount * foodLevelTTLHrsToSec())));
            return this;
        };

        /**
         * @function decrFoodLevel
         * @param {Number} amount
         * @returns {Tamagotchi}
         */
        this.decrFoodLevel = function(amount) {
            this.foodLevel -= amount;
            if (this.foodLevel >= 0 && this.foodLevel <= 0.5) {
                $.say($.whisperPrefix(this.owner) + $.lang.get('tamagotchi.needsfood', this.name, this.getSexString()));
            }
            return this;
        };

        /**
         * @function incrFunLevel
         * @param {Number} amount
         * @returns {Tamagotchi}
         */
        this.incrFunLevel = function(amount) {
            this.funLevel += amount;
            if (this.funLevel > baseLevelCap / 2) {
                this.funLevel = baseLevelCap / 2;
            }
            return this;
        };

        /**
         * @function decrFunLevel
         * @param {Number} amount
         * @returns {Tamagotchi}
         */
        this.decrFunLevel = function(amount) {
            this.funLevel -= amount;
            if (this.funLevel < 0) {
                this.funLevel = 0;
            }
            return this;
        };

        /**
         * @function incrExpLevel
         * @param {Number} amount
         * @returns {Tamagotchi}
         */
        this.incrExpLevel = function(amount) {
            this.expLevel += amount;
            if (this.expLevel > baseLevelCap) {
                this.expLevel = baseLevelCap;
            }
            return this;
        };

        /**
         * @function sayAge
         * @returns {Tamagotchi}
         */
        this.sayAge = function() {
            $.say($.lang.get('tamagotchi.showage', $.username.resolve(this.owner), this.name, $.getTimeString(this.getAgeInSeconds()), Math.round(this.foodLevel)));
            return this;
        };

        /**
         * @function sayExpLevel
         * @returns {Tamagotchi}
         */
        this.sayExpLevel = function() {
            $.say($.lang.get('tamagotchi.explevel', this.name, Math.floor(this.expLevel)));
            return this;
        };

        /**
         * @function sayFunLevel
         * @returns {Tamagotchi}
         */
        this.sayFunLevel = function () {
            if (this.funLevel > 7) {
                $.say($.lang.get('tamagotchi.funlevel.ishappy', $.username.resolve(this.owner), this.name));
            } else if (this.funLevel > 0) {
                $.say($.lang.get('tamagotchi.funlevel.ismeh', $.username.resolve(this.owner), this.name, this.getSexString()));
            } else {
                $.say($.lang.get('tamagotchi.funlevel.issad', $.username.resolve(this.owner), this.name, this.getSexString()));
            }
            return this;
        };

        /**
         * @function sayHeistFunLevel
         * @returns {Tamagotchi}
         */
        this.sayHeistFunLevel = function () {
            if (this.funLevel > 7) {
                $.say($.lang.get('tamagotchi.funlevel.heist.ishappy', $.username.resolve(this.owner), this.name, this.owner));
            } else if (this.funLevel > 0) {
                $.say($.lang.get('tamagotchi.funlevel.heist.ismeh', $.username.resolve(this.owner), this.name, this.getSexString()));
            } else {
                $.say($.lang.get('tamagotchi.funlevel.heist.issad', $.username.resolve(this.owner), this.name, this.getSexString()));
            }
            return this;
        };

        /**
         * @function sayFoodLevelTooLow
         * @returns {Tamagotchi}
         */
        this.sayFoodLevelTooLow = function() {
            $.say($.lang.get('tamagotchi.foodlow', this.name));
            return this;
        };
    }

    /**
     * @function getTypesString
     * @returns {string}
     */
    function getTypesString() {
        return defaultAnimals.join(', ');
    }

    /**
     * @function getTypeAsString
     * @returns {string}
     */
    function getTypeAsString(animal) {
        return $.lang.get('tamagotchi.pet.'+ animal);
    }

    /**
     * @function typeExists
     * @param {string} type
     * @returns {boolean}
     */
    function typeExists(type) {
        for (var i in defaultAnimals) {
            if (defaultAnimals[i].equalsIgnoreCase(type)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @function getByOwner
     * @export $.tamagotchi
     * @param {string} owner
     * @returns {Tamagotchi}
     */
    function getByOwner(owner) {
        if (!tgExists(owner)) {
            return null;
        }
        var dbTGInfo = JSON.parse($.inidb.get('tamagotchi', owner.toLowerCase()));
        return new Tamagotchi(
            dbTGInfo.owner,
            dbTGInfo.type,
            dbTGInfo.name,
            dbTGInfo.dob,
            dbTGInfo.foodLevel,
            dbTGInfo.funLevel,
            dbTGInfo.expLevel,
            dbTGInfo.sex
        );
    }

    /**
     * @function tgExists
     * @export $.tamagotchi
     * @param {string} owner
     * @returns {boolean}
     */
    function tgExists(owner) {
        return $.inidb.exists('tamagotchi', owner.toLowerCase());
    }

    /**
     * @function say404
     * @export $.tamagotchi
     * @param {string} sender
     */
    function say404(sender) {
        $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.404', getTypesString(), $.getPointsString(pricing.buyNewTG)));
    }

    /**
     * @function sayTarget404
     * @export $.tamagotchi
     * @param sender
     * @param target
     */
    function sayTarget404(sender, target) {
        $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.404foruser', $.username.resolve(target)));
    }

    /**
     * @function foodLevelTTLHrsToSec
     * @export $.tamagotchi
     * @returns {Number}
     */
    function foodLevelTTLHrsToSec() {
        return (foodLevelTTLHrs * 3600);
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var command = event.getCommand(),
            sender = event.getSender().toLowerCase(),
            senderPoints = $.getUserPoints(sender),
            args = event.getArgs();

        /**
         * @commandpath tamagotchi - Get information about a tamagotchi or how to get one
         */
        if (command.equalsIgnoreCase('tamagotchi')) {
            if (args.length > 0) {
                if (tgExists(args[0])) {
                    getByOwner(args[0]).sayAge().sayFunLevel().sayExpLevel();
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.404foruser', $.username.resolve(args[0])));
                }
                return;
            }
            if (tgExists(sender)) {
                getByOwner(sender).sayAge().sayFunLevel().sayExpLevel();
            } else {
                say404(sender);
            }
        }

        /**
         * @commandpath tgbuy [type] [name] - By a new tamagotchi
         */
        if (command.equalsIgnoreCase('tgbuy')) {
            if (args.length < 2 || !typeExists(args[0])) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.buytamagotchi.usage', getTypesString(), $.getPointsString(pricing.buyNewTG)));
                return;
            }

            if (senderPoints < pricing.buyNewTG) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.buytamagotchi.needpoints', $.pointNameMultiple, $.getPointsString(pricing.buyNewTG)));
                return;
            }

            if (tgExists(sender)) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.buytamagotchi.alreadyown'));
                return;
            }

            if ($.strlen(args[1]) > 13) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.buytamagotchi.nametoolong'));
                return;
            }

            var newTG = new Tamagotchi(sender, args[0], args[1]).save();
            $.say($.lang.get('tamagotchi.bought', $.username.resolve(sender), newTG.getSexString('hatch'), getTypeAsString(newTG.type), newTG.name));
            //newTG.sayAge().sayFunLevel();
        }

        /**
         * @commandpath tgfeed [amount] - Feed your tamagotchi
         */
        if (command.equalsIgnoreCase('tgfeed')) {
            if (args.length < 1 || isNaN(parseInt(args[0]))) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.feedtamagotchi.usage', $.getPointsString(pricing.buyFood), $.getTimeString(foodLevelTTLHrsToSec(), true)));
                return;
            }

            var amount = parseInt(args[0]);
            var targetTG = getByOwner(sender);

            if (senderPoints < (pricing.buyFood * amount)) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.feedtamagotchi.needpoints', $.pointNameMultiple, $.getPointsString(pricing.buyFood)));
                return;
            }

            if (!targetTG) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.404', getTypesString(), $.getPointsString(pricing.buyNewTG)));
                return;
            }

            if (targetTG.foodLevel + amount > foodMax + Math.floor(targetTG.expLevel)) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.feedtamagotchi.maxreached', targetTG.name, foodMax + Math.floor(targetTG.expLevel)));
                return;
            }

            $.inidb.decr('points', sender.toLowerCase(), amount * pricing.buyFood);
            targetTG.incrFoodLevel(amount).save();
        }

        /**
         * @commandpath tgkill - Kill your tamagotchi
         */
        if (command.equalsIgnoreCase('tgkill')) {
            var tg = getByOwner(sender);
            if (!tg) {
                $.say($.whisperPrefix(sender) + $.lang.get('tamagotchi.buytamagotchi.usage', getTypesString(), $.getPointsString(pricing.buyNewTG)));
                return;
            }
            tg.kill();
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if($.bot.isModuleEnabled('./custom/games/tamagotchi.js')){
            doRunCheck();
            $.registerChatCommand('./custom/games/tamagotchi.js', 'tamagotchi', 6);
            $.registerChatCommand('./custom/games/tamagotchi.js', 'tgbuy', 6);
            $.registerChatCommand('./custom/games/tamagotchi.js', 'tgfeed', 6);
            $.registerChatCommand('./custom/games/tamagotchi.js', 'tgkill', 6);

            $.consoleDebug($.lang.get('tamagotchi.console.loaded', $.inidb.GetKeyList('tamagotchi', '').length));
        }
    });

    setTimeout(function() {
        setInterval(function () { runOneHour(); }, 36e5, 'scripts::custom::games::tamagotchi.js');
    }, 5e3);

    /** Export functions to API */
    $.tamagotchi = {
        getByOwner: getByOwner,
        getTypeAsString: getTypeAsString,
        tgExists: tgExists,
        say404: say404,
        sayTarget404: sayTarget404,
        foodLevelTTLHrsToSec: foodLevelTTLHrsToSec,
    };

    $.reloadTamagotchiSettings = reloadTamagotchiSettings;
})();