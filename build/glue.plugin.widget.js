!function(){

    var plugin = function($, glue){


	
/**
 * User: Evgeny Shpilevsky
 * Date: 2/6/12
 */

var List = (function(){

    /**
     * @class
     */
    var ListModel = function() {

    };

    /**
     * Extending
     */
    var f = function () {};
    f.prototype = Array.prototype;
    ListModel.prototype = new f();

    /**
     * Alias
     */
    var List = ListModel.prototype;

    /**
     * Clear all views
     */
    List.destroy = function() {
        this.forEach(function(view, index){
            view.destroy();
            this[index] = undefined;
        }, this);

        this.length = 0;
    };

    /**
     * Destroy widget and remove it from list
     *
     * @param widget
     */
    List.destroyWidget = function(widget) {
        var found = -1;

        for (var index = 0; index < this.length; index++) {
            if (found >= 0) {
                this[found++] = this[index];
            }
            else if (this[index] == widget) {
                found = index;
            }
        }

        if (found >= 0) {
            this.length--;
        }

        widget.destroy();
    };

    /**
     * @param widget
     */
    List.push = function(widget) {
        [].push.call(this, widget);
        return widget;
    };

    /**
     * Refresh all views in list
     */
    List.refresh = function() {
        for (var index = 0; index < this.length; index++) {
            this[index].refresh();
        }
    };

    return ListModel;

})();
	
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

	
/**
 * @return {Function}
 */
var widget = (function(){

    var Widget;

    /**
     * @param {Function} [constructor]
     */
    glue.fn.createWidget = function(constructor) {
        var view = function(config) {
            Widget.call(this, config);

            if (constructor) {
                constructor.call(this, config);
            }
        };

        var f = function () {};
        f.prototype = Widget.prototype;
        view.prototype = new f();

        view.extend = function(methods) {
            $.extend(view.prototype, methods);
        };

        return view;
    };

    /**
     * @class
     */
    Widget = glue.fn.Widget = function(config) {
        $.extend(this, config || {});

        this.glue = glue.getInstance();

        // List's of Widget
        this._widgetLists = [];

        // Dictionary's of Widget
        this._widgetDicts = [];

        // All widgets
        this._widgets = this.widgetList();

        // 'Find' cache
        this._findCache = {};

        // Leave dom flag
        this._leaveDom = false;
    };

    /**
     * Alias
     */
    var view = Widget.prototype;

    /**
     * Render
     */
    view.render = function() {
        throw new Error('You must implement render method');
    };

    /**
     * Refresh View
     */
    view.refresh = function() {

    };

    /**
     * Destroy View
     */
    view.destroy = function() {
        // Destroy dom
        if (!this._leaveDom && this.dom) {
            this.dom.remove();
        }

        // Clear glue reference
        if (this.glue) {
            this.glue.destroy();
        }

        // Destroy all lists
        if (this._widgetLists.length) {
            this._widgetLists.forEach(function(list){
                list.destroy();
            });
        }

        // Destroy all lists
        if (this._widgetDicts.length) {
            this._widgetDicts.forEach(function(list){
                list.destroy();
            });
        }
    };

    /**
     * Init events
     */
    view._initEvents = function() {

    };

    /**
     * Leave dom after destroy method invoked
     */
    view.leaveDomAfterDestroy = function() {
        this._leaveDom = true;
    };

    /**
     * Leave dom after destroy method invoked
     */
    view.removeDomAfterDestroy = function() {
        this._leaveDom = false;
    };

    /**
     * Create new Widget List
     */
    view.widgetList = function() {
        var list = new List();

        this._widgetLists.push(list);

        return list;
    };

    /**
     * Create new Widget dictionary's
     *
     * @param {Function} constructor
     * @param {Object} [config]
     */
    view.widgetDict = function(constructor, config) {
        if (typeof constructor !== 'function') {
            throw new Error('Constructor must be function');
        }

        var list = new Dict(constructor, config);

        this._widgetDicts.push(list);

        return list;
    };

    /**
     * Add widget to list. When 'destroy' method fire, this widget
     * will be destroyed
     *
     * @param widget
     */
    view.addWidget = function(widget) {
        this._widgets.push(widget);

        return widget;
    };

    /**
     * Destroy widget
     *
     * @param widget
     */
    view.destroyWidget = function(widget) {
        if (typeof widget == "string") {
            if (this[widget]) {
                this._widgets.destroyWidget(this[widget]);
                delete this[widget];
            }
        }
        else {
            this._widgets.destroyWidget(widget);
        }
    };

    /**
     * Return glue.Widget prototype
     */
    view.getProto = function() {
        return glue.Widget.prototype;
    };

    /**
     * Glue proxy
     */

    /**
     * Observer method in model, and invoke refresh
     *
     * @param {Array|String} method
     * @param {Function} [callback]
     * @param {Object} [context]
     */
    view.observer = function(method, callback, context) {
        if (typeof method == "string") {
            return this.glue.observer(method, this.model, callback || this.refresh, context || this);
        }

        return method.map(function(method){
            return this.observer(method, callback, context);
        }, this);
    };

    /**
     * jQuery proxy
     */


    /**
     * Show widget
     */
    view.show = function() {
        this.dom.show();
    };

    /**
     * Hide widget
     */
    view.hide = function() {
        this.dom.hide();
    };

    /**
     * Toggle widget state
     */
    view.toggle = function() {
        this.dom.toggle();
    };

    /**
     * Find elements in widget, list selector
     *
     * @param {String} selector
     * @param {Boolean} [ignoreCache]
     */
    view.find = function(selector, ignoreCache) {
        if (ignoreCache) {
            return this.dom.find(selector);
        }
        else {
            if (!this._findCache[selector]) {
                this._findCache[selector] = this.dom.find(selector);
            }

            return this._findCache[selector];
        }
    };

    /**
     * Filter elements in widget
     *
     * @param {String} selector
     */
    view.filter = function(selector) {
        return this.dom.filter(selector);
    };

    /**
     * @param selector
     * @param callback
     * @param [context]
     */
    view.click = function(selector, callback, context) {
        return this.bind('click', selector, callback, context);
    };

    /**
     * @param selector
     * @param type
     * @param callback
     * @param [context]
     */
    view.bind = function(type, selector, callback, context) {
        var self = this;

        if (typeof selector == 'function') {
            context = callback;
            callback = selector;
            selector = null;
        }

        if (selector) {
            var dom = this.dom.find(selector);
        }
        else {
            dom = this.dom;
        }

        dom.bind(type, function(event){
            event.preventDefault();
            return callback.call(context ? context : self, event);
        });
    };

    /**
     * Load template from DOM
     *
     * @param {String} name
     */
    view.getTemplate = function(name) {
        return $('#template-' + name).html().trim();
    };

    return glue.fn.createWidget;
})();

	
        return widget;
    };
    
    if (typeof this.define != "undefined") {
        this.define('glue/widget', ['jquery', 'glue'], plugin);
    }
    else {
        plugin(this.jQuery, this.glue);
    }
}();
	
