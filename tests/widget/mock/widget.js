var TestWidget = (function($) {

    /**
     * @constructor
     */
    var testWidgetView = glue.createWidget();

    /**
     * @alias
     */
    var testWidget = testWidgetView.prototype;

    /**
     * Render view
     */
    testWidget.render = function() {
        this.dom = $('<div></div>');

        this._initEvents();
        this.refresh();

        return this.dom;
    };

    /**
     * Refresh
     */
    testWidget.refresh = function() {

    };

    /**
     * Init view Events
     */
    testWidget._initEvents = function() {
        this.click(function(){
            this.dom.text('clicked');
        })
    };

    return testWidgetView;

})(this.jQuery);