(function(Instance){

    /**
     * Glue nexus class
     * @constructor
     */
    var Nexus = function() {
        this.id = uniqueId();
        this.callback = null;
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