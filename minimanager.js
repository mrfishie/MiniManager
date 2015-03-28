(function() {

"use strict";

/**
 * MiniManager
 *
 * The tiny instance manager
 *
 * @param {Object} obj The object to wrap around
 */
function MiniManager(obj) {
    if (typeof obj !== 'object' || obj == null) throw new TypeError('Expected object, got ' + typeof obj);

    var isEnabled = false, self = this, instance = {};
    Object.defineProperty(this, 'enabled', {
        get: function () {
            return isEnabled;
        },
        set: function (val) {
            isEnabled = !!val;
        }
    });

    function getProp(prop) {
        var val = obj[prop], getFunc;
        if (typeof val === 'function') {
            getFunc = function () {
                return function () {
                    // If the context is the instance, then use the base object to
                    // prevent weird things happening
                    var ctx = this === instance ? obj : this;
                    if (isEnabled) return obj[prop].apply(ctx, arguments);
                }
            };
        } else getFunc = function () {
            return obj[prop];
        };

        return {
            configurable: true,
            enumerable: obj.hasOwnProperty(prop),
            get: getFunc,
            set: function (val) {
                if (isEnabled) obj[prop] = val;
            }
        };
    }

    var defines = {};
    for (var prop in obj) {
        // We want to iterate over *all* properties (including prototypes)
        // so we don't want the .hasOwnProperty check here
        // if (!obj.hasOwnProperty(prop)) continue;
        defines[prop] = getProp(prop);
    }

    Object.defineProperties(instance, defines);
    Object.defineProperty(instance, '__enabled', {
        get: function () {
            return isEnabled;
        }
    });

    this.instance = instance;
}

//module.exports = MiniManager;

/**
 * Enables all functions and properties in the instance
 */
MiniManager.prototype.enable = function () {
    this.enabled = true;
};

/**
 * Disables all functions and properties in the instance
 */
MiniManager.prototype.disable = function () {
    this.enabled = false;
};

/**
 * Sets whether all functions and properties are enabled or disabled
 *
 * @param {boolean} enabled True- enabled, false- disabled
 */
MiniManager.prototype.set = function (enabled) {
    this.enabled = enabled;
};

/**
 * Finds if the instance is enabled or disabled
 *
 * @param {boolean=true} enabled True- find if enabled, false- find if disabled
 * @returns {boolean}
 */
MiniManager.prototype.is = function (enabled) {
    if (enabled == null) enabled = true;
    return this.enabled == enabled;
};

// Export for Node, AMD, or browser
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = MiniManager;
else if (typeof define === 'function' && define.amd) define([], function() { return MiniManager; });
else window.MiniManager = MiniManager;

}());