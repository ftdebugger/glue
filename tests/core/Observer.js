(function(){

    function getMock() {
        var obj = {
            'test': function(){
                equal(this, obj);
            }
        };

        return obj;
    }

    module('Observer');

    test('simple observer, save object context', 1, function(){
        var mock = getMock();
        glue.observer('test', mock, function(){});
        mock.test();
    });

    test('simple observer, save observer context', 2, function(){
        var mock = getMock();
        var context = {};

        glue.observer('test', mock, function(){
            equal(this, context);
        }, context);
        mock.test();
    });

    test('simple observer, test arguments', function(){
        var mock = getMock();

        var nexus = glue.observer('test', mock, function(e){
            equal(nexus, e);
        });
        mock.test();
    });

    test('simple observer, destroy nexus before invoke', 1, function(){
        var mock = getMock();

        var nexus = glue.observer('test', mock, function(){
            ok(false);
        });
        nexus.destroy();
        mock.test();
    });

    test('observer with once option', 3, function(){
        var mock = getMock();

        var nexus = glue.observer('test', mock, function(){
            ok(true);
        });

        nexus.once();
        mock.test();
        mock.test();
    });

    test('observer with async option', function(){
        var mock = getMock();

        var invoked = false;
        var nexus = glue.observer('test', mock, function(){
            invoked = true;
        });

        nexus.async();
        mock.test();
        ok(!invoked);
    });

    test('destroy all nexuses after instance destroyed', function(){
        var mock = getMock();

        var invoked = false;
        var instance = glue.getInstance();
        var nexus = instance.observer('test', mock, function(){
            ok(false)
        });

        instance.destroy();
        mock.test();
    });

})();