(function() {
    module("widget");

    test("widget init", function() {
        equal(typeof glue.createWidget(), 'function');
    });

    test('check widget methods', function(){
        var widget = glue.createWidget();
        var view = new widget();

        equal(typeof view.render, 'function');
        equal(typeof view.refresh, 'function');
        equal(typeof view.destroy, 'function');
    });

    test('check render method', function(){
        var widget = new TestWidget();
        var dom = widget.render();

        ok(dom instanceof jQuery);
    });

    test('check click', function(){
        var widget = new TestWidget();
        widget.render().click();

        equal(widget.dom.text(), 'clicked');
    });

})();
