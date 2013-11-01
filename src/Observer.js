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