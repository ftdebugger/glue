define(function(){

    /**
     * @constructor
     */
    var TaskModel = function(config) {
        this.title = "";

        $.extend(this, config);
    };

    /**
     * @alias
     * @type {Object}
     */
    var Task = TaskModel.prototype;

    /**
     * @return {Object}
     */
    Task.toJSON = function() {
        return {
            title: this.title
        }
    };

    return TaskModel;
});