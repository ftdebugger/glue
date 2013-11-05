!function(){

    var plugin = function($, glue){


/**
 * User: Evgeny Shpilevsky
 * Date: 2/6/12
 */

var model = (function () {
    "use strict";

    /**
     * @class
     */
    var Model = glue.fn.Model = function (config) {
        $.extend(this, config);
        var id = glue.getObjectId(this);
        this.constructor.attachModel(this);
    };

    /**
     * @type {{}}
     */
    Model.helpers = {};

    /**
     * Convert my_var_name to MyVarName
     * @param {String} name
     * @return {String}
     */
    var toUpperCase = function (name) {
        return name.split('_').map(function (part) {
            return part[0].toUpperCase() + part.slice(1);
        }).join('');
    };

    /**
     * @param {Function} constructor
     */
    var classHelpers = function (constructor) {
        var prototype = constructor.prototype;

        /**
         * Create setter for 'name' like 'setName'
         *
         * @param name
         */
        constructor.setter = function (name) {
            if (typeof name == 'string') {
                var setter = 'set' + toUpperCase(name);

                prototype[setter] = function (value) {
                    this[name] = value;
                    return this;
                };
            }
            else if (name instanceof Array) {
                name.forEach(constructor.setter, this);
            }

            return constructor;
        };

        /**
         * Create getter for 'name' like 'getName'
         *
         * @param name
         */
        constructor.getter = function (name) {
            if (typeof name == 'string') {
                var getter = 'get' + toUpperCase(name);

                prototype[getter] = function () {
                    return this[name];
                };
            }
            else if (name instanceof Array) {
                name.forEach(constructor.getter, this);
            }

            return constructor;
        };

        /**
         * Create setter and getter
         *
         * @param name
         */
        constructor.accessor = function (name) {
            this.setter(name);
            this.getter(name);

            return constructor;
        };

        /**
         * Extend default functionality
         *
         * @param methods
         */
        constructor.extend = function (methods) {
            $.extend(this.prototype, methods);

            return constructor;
        };

        /**
         * Models
         *
         * @type {Array}
         */
        constructor.models = [];

        /**
         * Attach model
         *
         * @param model
         */
        constructor.attachModel = function (model) {
            if (!(model instanceof constructor)) {
                throw new Error('This model is not from this collection');
            }

            constructor.models.push(model);

            return constructor;
        };

        /**
         * Detach model
         *
         * @param model
         */
        constructor.detachModel = function (model) {
            if (!(model instanceof constructor)) {
                throw new Error('This model is not from this collection');
            }

            var index = constructor.models.indexOf(model);
            if (index >= 0) {
                constructor.models.splice(index, 1);
            }

            return constructor;
        };

        $.extend(constructor, Model.helpers);

        /**
         * Detach model from collection,
         * destroy glue
         */
        prototype.destroy = function () {
            if (this.glue) {
                this.glue.destroy();
                this.glue = null;
            }

            constructor.detachModel(this);
        };

        /**
         * Return glue instance for current model
         *
         * @returns {Instance}
         */
        prototype.getGlue = function () {
            if (!this.glue) {
                this.glue = glue.getInstance();
            }

            return this.glue;
        };

    };

    /**
     * Create glue model
     *
     * @param {function} constructor
     */
    glue.fn.createModel = function (constructor) {

        //noinspection FunctionWithInconsistentReturnsJS
        var model = function (config) {

            if (!(this instanceof model)) {
                return new model(config);
            }

            glue.Model.call(this, config);

            if (constructor) {
                constructor.call(this, config);
            }
        };

        var f = function () {
        };
        f.prototype = Model.prototype;
        model.prototype = new f();
        model.prototype.constructor = model;

        classHelpers(model);

        return model;
    };

    /**
     *
     */
    return glue.createModel;
});
        return model;
    };
    
    if (typeof this.define != "undefined") {
        this.define('glue/model', ['jquery', 'glue'], plugin);
    }
    else {
        plugin(this.jQuery, this.glue)();
    }
}();