
var Instance = (function(){

    /**
     * @param {Instance|undefined} [parent]
     */
    var Instance = function(parent){
        this.id = uniqueId();

        this.nexuses = {};
        this.instances = {};

        this.parent = parent;
    };

    /**
     * @alias
     * @type {Object}
     */
    Instance.fn = Instance.prototype;

    /**
     * @return {Instance}
     */
    Instance.fn.getInstance = function() {
        var instance = new Instance(this);

        this.instances[instance.id] = instance;

        return instance;
    };

    /**
     * @param {Instance} instance
     */
    Instance.fn.removeInstance = function(instance) {
        delete this.instances[instance.id];
    };

    /**
     * Clear glues, destroy observers, remove instance
     */
    Instance.fn.destroy = function() {

        for (var index in this.nexuses) {
            if (this.nexuses.hasOwnProperty(index)) {
                var glue = this.nexuses[index];
                glue.destroy();
            }
        }

        for (var key in this.instances) {
            if (this.instances.hasOwnProperty(key)) {
                this.instances[key].destroy();
            }
        }

        if (this.parent) {
            this.parent.removeInstance(this);
        }
    };

    /**
     * @param {Object} object
     * @return {Number}
     */
    Instance.fn.getObjectId = function(object) {
        var idString = '__glue_object_id';

        if (!object[idString]) {
            object[idString] = uniqueId();
        }

        return object[idString];
    };

    /**
     * @param {Function|String} accessor
     * @param {Object} context
     */
    Instance.fn.callback = function(accessor, context) {
        var func;

        if (typeof accessor == "function") {
            func = accessor;
        }
        else if ((context && typeof context == "object") && (typeof context[accessor] == 'function')) {
            func = context[accessor];
        }
        else if (typeof window[accessor] == 'function') {
            func = window[accessor];
        }

        if (!func) {
            throw new Error('accessor must be valid callback');
        }

        if (context && typeof context == "object") {
            func = func.bind(context);
        }

        return func;
    };

    return Instance;
})();

