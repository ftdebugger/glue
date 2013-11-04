define(['jquery', 'tasks/models/Tasks', 'tasks/widgets/Tasks'], function($, Tasks, TasksWidget){
    var tasks = new Tasks();
    tasks.load();

    var widget = new TasksWidget({
        model: tasks
    });

    $("#tasks").append(widget.render());
});