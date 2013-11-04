define(['tasks/models/Task'], function(Task){

    /**
     * @constructor
     */
    var TasksModel = function() {
        this.tasks = [];
    };

    /**
     * @alias
     * @type {Object}
     */
    var Tasks = TasksModel.prototype;

    /**
     * Save tasks to storage
     */
    Tasks.save = function() {
        var tasks = this.tasks.map(function(task){
            return task.toJSON();
        });

        window.localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    /**
     * Load tasks from storage
     */
    Tasks.load = function() {
        var tasks = window.localStorage.getItem('tasks');
        if (tasks) {
            tasks = JSON.parse(tasks);
            tasks.forEach(this.createTask, this);
        }
    };

    /**
     * @return {Array}
     */
    Tasks.getTasks = function() {
        return this.tasks;
    };

    /**
     * @param task
     */
    Tasks.addTask = function(task) {
        this.tasks.push(task);
        this.save();
    };

    /**
     * @param task
     */
    Tasks.removeTask = function(task) {
        this.tasks = this.tasks.filter(function(current){
            return current != task;
        });
        this.save();
    };

    /**
     * @return {*}
     */
    Tasks.createTask = function(config) {
        var task = new Task(config);
        this.addTask(task);
        return task;
    };

    return TasksModel;
});