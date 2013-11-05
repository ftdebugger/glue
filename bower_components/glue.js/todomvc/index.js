$(function () {
    var tasks = TaskModel.load();

    var widget = new TasksWidget({
        model: TaskModel
    });

    $("#tasks").append(widget.render());
});