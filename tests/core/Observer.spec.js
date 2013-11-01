describe('Observer', function () {

    var mock, mockMethod;

    beforeEach(function () {
        mock = jasmine.createSpyObj('mock', ['test']);
        mockMethod = mock.test
    });

    it('simple observer, save object context', function () {
        var callback = jasmine.createSpy('callback');

        glue.observer('test', mock, callback);
        mock.test();

        expect(mockMethod).toHaveBeenCalled()
        expect(callback).toHaveBeenCalled()
    });

    it('simple observer, save observer context', function () {
        var context = {};

        glue.observer('test', mock, function () {
            expect(this).toBe(context);
        }, context);

        mock.test();

        expect(mockMethod).toHaveBeenCalled()
    });

    it('simple observer, test arguments', function () {
        var nexus = glue.observer('test', mock, function (e) {
            expect(e).toBe(nexus)
        });
        mock.test();
    });

    it('simple observer, destroy nexus before invoke', function () {

        var nexus = glue.observer('test', mock, function () {
            expect(true).toBe(false);
        });

        nexus.destroy();
        mock.test();
    });

    it('observer with once option', function () {
        var count = 0;

        var nexus = glue.observer('test', mock, function () {
            expect(++count).toBe(1);
        });

        nexus.once();
        mock.test();
        mock.test();
    });

    it('observer with async option', function () {
        var invoked = false;
        runs(function () {
            var nexus = glue.observer('test', mock, function () {
                invoked = true;
            });

            nexus.async();
            mock.test();
            expect(invoked).toBe(false);
        });

        waitsFor(function () {
            return invoked;
        }, "Method never execute", 100);

        runs(function(){
            expect(invoked).toBe(true);
        })
    });

    it('destroy all nexuses after instance destroyed', function () {
        var instance = glue.getInstance();
        instance.observer('test', mock, function () {
            expect(true).toBe(false);
        });

        instance.destroy();
        mock.test();
    });

});