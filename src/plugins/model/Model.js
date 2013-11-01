/**
 * User: Evgeny Shpilevsky
 * Date: 2/6/12
 */

var model = (function(){
    "use strict";

    /**
     * @class
     */
    var Model = glue.fn.Model = function(config) {
        $.extend(this, config);
    };

    /**
     * Create glue model
     *
     * @param {function} constructor
     */
    glue.fn.createModel = function(constructor) {
        var model = function(config) {
            glue.Model.call(this, config);

            if (constructor) {
                constructor.call(this, config);
            }
        };

        var f = function () {};
        f.prototype = Model.prototype;
        model.prototype = new f();

        glue.classHelpers(model);

        return model;
    };

    /**
     * Convert my_var_name to MyVarName
     * @param {String} name
     * @return {String}
     */
    glue.fn.toUpperCase = function(name) {
        return name.split('_').map(function(part){
            return part[0].toUpperCase() + part.slice(1);
        }).join('');
    };

    /**
     * @param {Function} constructor
     */
    glue.fn.classHelpers = function(constructor) {
        var prototype = constructor.prototype;

        /**
         * Create setter for 'name' like 'setName'
         *
         * @param name
         */
        constructor.setter = function(name) {
            if (typeof name == 'string') {
                var setter = 'set' + glue.toUpperCase(name);

                prototype[setter] = function(value) {
                    this[name] = value;
                };
            }
            else if (name instanceof Array) {
                name.forEach(constructor.setter, this);
            }
        };

        /**
         * Create getter for 'name' like 'getName'
         *
         * @param name
         */
        constructor.getter = function(name) {
            if (typeof name == 'string') {
                var getter = 'get' + glue.toUpperCase(name);

                prototype[getter] = function() {
                    return this[name];
                };
            }
            else if (name instanceof Array) {
                name.forEach(constructor.getter, this);
            }
        };

        /**
         * Create setter and getter
         *
         * @param name
         */
        constructor.accessor = function(name) {
            this.setter(name);
            this.getter(name);
        };

        /**
         * Extend default functionality
         *
         * @param methods
         */
        constructor.extend = function(methods) {
            $.extend(this.prototype, methods);
        };
    };

    /**
     *
     */
    return glue.createModel;
});