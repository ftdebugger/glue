!function() {
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

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

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


(function(Instance){

    /**
     * @const
     */
    var NAME = '__glueListener';

    /**
     * Listener class
     *
     * @param method
     * @param object
     * @constructor
     */
    var Listener = function(method, object) {
        this.method = method;
        this.object = object;
        this.nexuses = {};
    };

    /**
     * @type {Function}
     */
    Instance.fn.Listener = Listener;

    /**
     * @type {Object}
     * @alias
     */
    var ListenerPrototype = Listener.prototype;

    /**
     * Replace function
     */
    ListenerPrototype.replace = function() {
        var me = this;
        var original = this.object[this.method];

        this.object[this.method] = function() {
            var args = Array.prototype.slice.call(arguments);
            var ret, object = this;

            ret = original.apply(object, args);
            me.invoke(args, object);

            return ret;
        };

        this.object[this.method][NAME] = this;
    };

    /**
     * Invoke
     */
    ListenerPrototype.invoke = function(args, context) {
        var nexuses = this.nexuses;
        // Invoke main glues
        for (var index in nexuses) {
            if (nexuses.hasOwnProperty(index)) {
                nexuses[index].args = args;
                nexuses[index].invokeContext(context);
            }
        }
    };

    /**
     * @param {Nexus} nexus
     */
    ListenerPrototype.addObserver = function(nexus) {
        this.nexuses[nexus.id] = nexus;
        nexus.listener = this;
    };

    /**
     * @param {Number} nexusId
     */
    ListenerPrototype.removeNexus = function(nexusId) {
        delete this.nexuses[nexusId];
    };

    /**
     * @param method
     * @param object
     */
    Instance.fn.getListener = function(method, object) {
        if ( !(method in object) ) {
            throw new Error('Method not exists');
        }

        var original = object[method];

        if (original[NAME] && object.hasOwnProperty(method)) {
            return original[NAME];
        }
        else {
            var listener = new Listener(method, object);
            listener.replace();

            return listener;
        }
    };
})(Instance);
(function(Instance){

    /**
     * Glue nexus class
     * @constructor
     */
    var Nexus = function() {
        this.id = uniqueId();
        this.callback = null;
        this.listener = null;
    };

    /**
     * @type {Function}
     */
    Instance.fn.Nexus = Nexus;

    /**
     * Alias
     * @type {Object}
     */
    var NexusPrototype = Nexus.prototype;

    /**
     * @param {Function|String}accessor
     * @param {Object} [context]
     *
     * @return {Nexus}
     */
    NexusPrototype.setCallback = function(accessor, context) {
        if (accessor) {
            this.callback = this.instance.callback(accessor, context);
        }

        return this;
    };

    /**
     * Invoke only once
     */
    NexusPrototype.once = function() {
        var callback = this.callback;
        var self = this;

        this.callback = function() {
            callback.apply(this, [].slice.call(arguments));
            self.destroy();
        };

        return this;
    };

    /**
     * Run nexus in async mode
     * @param {Number|undefined} time
     */
    NexusPrototype.async = function(time) {
        var callback = this.callback;

        this.callback = function() {
            setTimeout(function(){
                callback.apply(this, [].slice.call(arguments));
            }, time || 10);
        };

        return this;
    };

    /**
     * Invoke glue callback
     */
    NexusPrototype.invoke = function() {
        this.invokeContext(this);
    };

    /**
     * Invoke nexus in context
     *
     * @param context
     */
    NexusPrototype.invokeContext = function(context) {
        try {
            this.callback.call(context, this);
        } catch(e) {
            console.error(e);
        }
    };

    /**
     * Destroy glue nexus
     */
    NexusPrototype.destroy = function() {
        delete this.instance.nexuses[this.id];

        if (this.listener) {
            this.listener.removeNexus(this.id);
        }
    };

    /**
     * @return {Nexus}
     */
    Instance.fn.getNexus = function() {
        var nexus = new Nexus();
        nexus.instance = this;
        this.nexuses[nexus.id] = nexus;

        return nexus;
    };

})(Instance);
(function(Instance){


    /**
     * Create observer to method
     * @param {String} method
     *  observerable method, must be string
     * @param {Object} object
     *  valid object which contains 'method'
     * @param {String|Function} [accessor]
     *  callback function
     * @param {Object|undefined} [context]
     *  callback context
     */
    Instance.fn.observer = function(method, object, accessor, context) {
        if ( !(method in object) ) {
            throw new Error('Method ' + method + ' not exists');
        }

        var nexus = this.getNexus();
        var listener = this.getListener(method, object);
        listener.addObserver(nexus);

        if (accessor) {
            nexus.setCallback(accessor, context);
        }

        return nexus;
    };

})(Instance);
    var glue = new Instance();
    glue.fn = Instance.fn;

//    glue.Instance = Instance;

    // export library
    if (typeof this.define != "undefined") {
        this.define("glue", function() {
            return glue;
        });
    }
    else {
        this.glue = glue;
    }
}();