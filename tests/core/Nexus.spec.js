describe('Nexus test', function(){

    it('create instance', function(){
        var nexus = glue.getNexus();
        expect(typeof nexus).toBe('object')
    });

    it('nexus set callback without context', function(){
        var callback = jasmine.createSpy('callback');

        var nexus = glue.getNexus();
        nexus.setCallback(callback);
        nexus.callback();

        expect(callback).toHaveBeenCalled()
    });

    it('nexus set callback with context', function(){
        var context = {'test': 'work'};

        var callback = function(){
            expect(this['test']).toBe('work');
        };

        var nexus = glue.getNexus();
        nexus.setCallback(callback, context);
        nexus.callback();
    });

    it("test destroy nexus", function(){
        var myGlue = glue.getInstance();
        var nexus = myGlue.getNexus();

        expect(_.size(myGlue.nexuses)).toBe(1);
        nexus.destroy();
        expect(_.size(myGlue.nexuses)).toBe(0);
    });
});

