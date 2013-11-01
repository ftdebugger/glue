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
