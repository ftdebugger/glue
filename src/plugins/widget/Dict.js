/**
 * Created for vuvu.tv.
 * User: Evgeny Shpilevsky
 * Date: 2/6/12
 */
var Dict = (function(){

    /**
     * @constructor
     * @param {Function} constructor
     * @param {Object} [config]
     * @param {Boolean} config.removeRest
     * @param {Function} config.constructor
     * @param {Object|Function} config.viewConfig
     */
    var DictModel = function(constructor, config) {
        this.dict = {};
        this.removeRest = true;
        this.constructor = constructor;
        this.widgetConfig = false;
        this.autoReorder = false;

        $.extend(this, config || {});
    };

    /**
     * Alias
     */
    var Dict = DictModel.prototype;

    /**
     * @param {Array} collection
     * @param {jQuery} wrapper
     */
    Dict.apply = function(collection, wrapper) {
        if (this.removeRest) {
            var keys = this._keys();
        }

        var idCollection = [];

        collection.forEach(function(model){
            var modelId = glue.getObjectId(model);
            idCollection.push(modelId);

            if (!this.dict[modelId]) {
                this.dict[modelId] = this.factory(model);

                wrapper.append(this.dict[modelId].render());
            }
            else if (this.autoReorder) {
                wrapper.append(this.dict[modelId].render());
            }

        }, this);

        if (this.removeRest) {
            keys = this._diff(keys, idCollection);
            keys.forEach(this.destroyWidget, this);
        }
    };

    /**
     * @return {Array}
     * @private
     */
    Dict._keys = function() {
        var dict = this.dict;
        var keys = [];

        for(var key in dict) {
            if (dict.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        return keys;
    };

    /**
     * Return diff between array1 and array2
     *
     * @param array1
     * @param array2
     *
     * @return {Array}
     */
    Dict._diff = function (array1, array2) {
        var result = [];

        array1.forEach(function (value) {
            for (var index = 0; index < array2.length; index++) {
                if (array2[index] == value) {
                    return;
                }
            }

            result.push(value);
        });

        return result;
    };

    /**
     * @param model
     * @param [extra]
     */
    Dict.factory = function(model, extra) {
        var config = this._getWidgetConfig();
        extra = extra || {};
        extra.model = model;

        $.extend(extra, config);

        if (typeof this.constructor != "function") {
            throw new Error('Constructor must be function');
        }

        return new this.constructor(extra);
    };

    /**
     * @param widgetId
     */
    Dict.destroyWidget = function(widgetId) {
        this.dict[widgetId].destroy();
        delete this.dict[widgetId];
    };

    /**
     * @return {Object}
     */
    Dict._getWidgetConfig = function() {
        if (typeof this.widgetConfig == "function") {
            var config = this.widgetConfig();
        }
        else {
            config = this.widgetConfig;
        }

        if (typeof config != "object") {
            config = {};
        }

        return config;
    };

    /**
     * Destroy
     */
    Dict.destroy = function() {
        this.forEach(function(view){
            view.destroy();
        });

        this.dict = {};
    };

    /**
     * @param callback
     * @param context
     */
    Dict.forEach = function(callback, context) {
        if (context) {
            callback = callback.bind(context);
        }

        for (var key in this.dict) {
            if (this.dict.hasOwnProperty(key)) {
                callback(this.dict[key]);
            }
        }
    };

    return DictModel;
})();
