define([
        'jquery',
        'glue/widget',
        'tasks/widgets/template'
    ],
function($, Widget, template) {

    /**
     * @constructor
     */
    var TaskView = Widget(function() {
        this.template = template;
    });

    /**
     * Alias
     */
    var Task = TaskView.prototype;

    /**
     * Render view
     */
    Task.render = function() {
        this.dom = $(this.template.task().supplant(this.model));

        this._initEvents();
        this.refresh();

        return this.dom;
    };

    /**
     * Refresh
     */
    Task.refresh = function() {

    };

    Task.editMode = function() {
        this.dom.addClass('editing');
    };

    /**
     * Return to normal mode
     */
    Task.normalMode = function() {
        this.dom.removeClass('editing');
        this.model.title = this.find("edit-box").val();
        this.model.save();
    };

    /**
     * Init view Events
     */
    Task._initEvents = function() {
        var self = this;
        var box = this.find(".edit-box");

        this.dom.bind("dblclick", function(){
            self.editMode();
            box.focus()
        });

        box.bind("blur", this.normalMode.bind(this));
        box.bind("keydown", function(event){
            if (event.keyCode == 13) {
                self.normalMode();
            }
        });
    };

    return TaskView;

});