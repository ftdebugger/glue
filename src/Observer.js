(function(Instance){


    /**
     * Create observer to method
     * @param {String} method
     *  observerable method, must be string
     * @param {Object} object
     *  valid object which contains 'method'
     * @param {Boolean} strict @deprecated
     *  strict observe object and invoke at it context or allow child objects
     * @param {String|Function} [accessor]
     *  callback function
     * @param {Object|undefined} [context]
     *  callback context
     */
    Instance.fn.observer = function(method, object, strict, accessor, context) {
        if ( !(method in object) ) {
            throw new Error('Method ' + method + ' not exists');
        }

        if (typeof strict != "boolean") {
            context = accessor;
            accessor = strict;
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