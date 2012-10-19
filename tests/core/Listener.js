module('Listener test');

test('create listener', function(){
    var obj = {
        test: function(){
            equal(this, obj);
        }
    };
    var test = obj.test;

    glue.getListener('test', obj);
    notEqual(obj.test, test);
    obj.test();
});


test('double create listener', function(){
    var obj = {
        test: function(){
            equal(this, obj);
        }
    };

    var test = obj.test;

    glue.getListener('test', obj);
    notEqual(obj.test, test);

    test = obj.test;
    glue.getListener('test', obj);
    equal(obj.test, test);

    obj.test();
});