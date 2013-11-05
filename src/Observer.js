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
        if ( !object ) {
            throw new Error('Object passed to observer have unsupported type "' + (typeof object) + '"');
        }

        if (method instanceof Array) {
            return method.map(function(method){
                return this.observer(method, object, accessor, context);
            }, this)
        }

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