/**
 * @author  Evgeny Shpilevsky <evgeny.shpilevsky@gmail.com>
 * @date    10/19/12
 */

var TasksWidget = glue.createWidget(function () {
    this.tasks = this.widgetDict(TaskWidget, {
        widgetConfig: {
            tasks: this.model
        }
    });
})
    .extend({

        /**
         * Render view
         */
        render: function () {
            this.dom = this.renderTemplate("main");

            this._initEvents();
            this.refresh();

            return this.dom;
        },

        /**
         * Refresh
         */
        refresh: function () {
            this.tasks.apply(this.model.models, this.find(".items"));
            this.find(".countVal").text(this.model.left());
        },

        /**
         * Clear done tasks
         */
        clear: function() {
            this.model.getDone().forEach(function(task){
                task.destroy();
                task.save();
            });
        },

        /**
         * Init view Events
         */
        _initEvents: function () {
            this.observer(["attachModel", "detachModel", "save"]);

            this.find(".task-title").on("keydown", function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();

                    var $this = $(this);
                    if ($this.val()) {
                        var task = new TaskModel({
                            title: $this.val(),
                            done: false
                        });
                        task.save();

                        $this.val('');
                    }
                }
            });

            this.click(".clear", this.clear);
        }
    });