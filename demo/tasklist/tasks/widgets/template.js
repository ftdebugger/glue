/**
 * @author  Evgeny Shpilevsky <evgeny.shpilevsky@gmail.com>
 * @date    10/19/12
 */

define(function() {

    /**
     * @type {Object}
     */
    var template = {};

    /**
     * @return {String}
     */
    template.main = function() {
        return '<div>' +
                '<h1>Todos</h1>' +
                '<form><input type="text" class="task-title" placeholder="What needs to be done?"></form>' +
                '<div class="items"></div>' +
                '<footer>' +
                    '<a class="clear">Clear completed</a>' +
                    '<div class="count"><span class="countVal"></span> left</div>' +
                '</footer>' +
            '</div>';
    };

    /**
     * @return {String}
     */
    template.task = function() {
        return '<div class="item {?done}done{/done}">' +
                    '<div class="view" title="Double click to edit...">' +
                        '<input type="checkbox" {?done}checked="checked"{/done}>' +
                        '<span class="title">{title|e}</span> <a class="destroy"></a>' +
                    '</div>' +

                    '<div class="edit">' +
                        '<input type="text" class="edit-box" value="{title|e}">' +
                    '</div>' +
                '</div>';
    };

    return template;
});