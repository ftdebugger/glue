describe('Listener test', function(){

    var obj, test;

    beforeEach(function(){
        obj = jasmine.createSpyObj('obj', ['test']);
        test = obj.test;
    });

    it('create listener', function(){
        var myGlue = glue.getInstance();

        myGlue.getListener('test', obj);
        expect(obj.test).not.toBe(test);
        obj.test();

        expect(test).toHaveBeenCalled();
    });

    it('double create listener', function(){
        var myGlue = glue.getInstance();

        myGlue.getListener('test', obj);
        expect(obj.test).not.toBe(test);

        var newMethod = obj.test;
        myGlue.getListener('test', obj);
        expect(obj.test).toBe(newMethod);

        obj.test();

        expect(test).toHaveBeenCalled();
    });
});

