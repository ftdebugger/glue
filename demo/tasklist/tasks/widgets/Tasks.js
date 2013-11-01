/**
 * @author  Evgeny Shpilevsky <evgeny.shpilevsky@gmail.com>
 * @date    10/19/12
 */

define([
        'jquery',
        'glue/widget',
        'tasks/widgets/Task',
        'tasks/widgets/template',
        'lib/supplant'
    ],
function($, Widget, TaskView, template) {

    /**
     * @constructor
     */
    var TasksView = Widget(function() {
        this.template = template;
        this.tasks = this.widgetDict(TaskView);
    });

    /**
     * Alias
     */
    var Tasks = TasksView.prototype;

    /**
     * Render view
     */
    Tasks.render = function() {
        this.dom = $(this.template.main().supplant(this.model));

        this._initEvents();
        this.refresh();

        return this.dom;
    };

    /**
     * Refresh
     */
    Tasks.refresh = function() {
        this.tasks.apply(this.model.getTasks(), this.find(".items"));
    };

    /**
     * Init view Events
     */
    Tasks._initEvents = function() {
        this.observer(['addTask', 'removeTask']);

        var self = this;
        this.find(".task-title").bind("keydown", function(event){
            if (event.keyCode == 13) {
                var me = $(event.target);
                if (me.val()) {
                    self.model.createTask({
                        title: me.val()
                    });

                    me.val('');
                }

                return false;
            }
        })
    };

    return TasksView;

});