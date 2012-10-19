(function(){
    module('test instance');

    test("create sub instance", function(){
        var cnt = count(glue.instances);
        var sub = glue.getInstance();

        equal(typeof sub, 'object');
        equal(count(glue.instances), cnt + 1);
    });

    test("remove sub instance", function(){
        var cnt = count(glue.instances);
        var sub = glue.getInstance();
        glue.removeInstance(sub);
        equal(count(glue.instances), cnt);
    });

    test("clear sub instances", function(){
        glue.getInstance();
        glue.getInstance();
        glue.getInstance();
        glue.destroy();
        equal(count(glue.instances), 0);
    });
})();
