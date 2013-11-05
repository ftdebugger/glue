/**
 * @constructor
 */
var TaskModel = glue.createModel(function(){
    this.done = !!this.done;
})
    .extend({

        /**
         * Save model
         */
        save: function() {
            TaskModel.save();
        },

        /**
         * Convert to json for save
         *
         * @returns {{title: *}}
         */
        toJSON: function () {
            return {
                title: this.title,
                done: this.done
            }
        }
    })
    .accessor(['title', 'done']);

/**
 * Save tasks
 */
TaskModel.save = function() {
    var tasks = this.models.map(function(task){
        return task.toJSON();
    });

    window.localStorage.setItem('tasks', JSON.stringify(tasks));
};

/**
 * Load tasks
 */
TaskModel.load = function() {
    var tasks = window.localStorage.getItem('tasks') || '[]';

    tasks = JSON.parse(tasks);
    return tasks.forEach(TaskModel, this);
};

/**
 * @returns {Array}
 */
TaskModel.getDone = function() {
    return _.where(this.models, {done: true});
};

/**
 * @return {Number}
 */
TaskModel.left = function() {
    return this.models.length - this.getDone().length;
};
