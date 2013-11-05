describe('widget', function() {
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

    })(jQuery);

    it("widget init", function() {
        expect(typeof glue.createWidget()).toBe('function');
    });

    it('check widget methods', function(){
        var widget = glue.createWidget();
        var view = new widget();

        expect(typeof view.render).toBe('function');
        expect(typeof view.refresh).toBe('function');
        expect(typeof view.destroy).toBe('function');
    });

    it('check render method', function(){
        var widget = new TestWidget();
        var dom = widget.render();

        expect(dom instanceof jQuery).toBe(true);
    });

    it('check click', function(){
        var widget = new TestWidget();
        widget.render().click();

        expect(widget.dom.text()).toBe('clicked');
    });

    it('should return constructor after invoke extend', function(){
        var Widget = glue.createWidget();
        expect(Widget.extend({})).toBe(Widget);
    })
});
