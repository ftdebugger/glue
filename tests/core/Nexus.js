module('Nexus test');

test('create instance', function(){
    var nexus = glue.getNexus();
    equal(typeof nexus, 'object')
});

test('nexus set callback without context', function(){
    var callback = function(){
        ok(true);
    };

    var nexus = glue.getNexus();
    nexus.setCallback(callback)
    nexus.callback();
});

test('nexus set callback with context', function(){
    var context = {'test': 'work'};

    var callback = function(){
        equal(this['test'], 'work');
    };

    var nexus = glue.getNexus();
    nexus.setCallback(callback, context);
    nexus.callback();
});

test("test destroy nexus", function(){
    var cnt = count(glue.nexuses);
    var nexus = glue.getNexus();
    notEqual(count(glue.nexuses), cnt);

    nexus.destroy();
    equal(count(glue.nexuses), cnt);
});