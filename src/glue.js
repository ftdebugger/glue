/**
 * Return unique id
 * @type {Number}
 */
var uniqueId = (function() {
    var uniqueId = 0;

    return function() {
        return uniqueId++;
    };
})();