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