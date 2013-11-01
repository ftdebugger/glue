describe('instance', function(){
    it("create sub instance", function(){
        var cnt = _.size(glue.instances);
        var sub = glue.getInstance();

        expect(typeof sub).toBe('object');
        expect(_.size(glue.instances)).toBe(cnt + 1);
    });

    it("remove sub instance", function(){
        var cnt = _.size(glue.instances);
        var sub = glue.getInstance();
        glue.removeInstance(sub);
        expect(_.size(glue.instances)).toBe(cnt);
    });

    it("clear sub instances", function(){
        var myGlue = glue.getInstance();

        myGlue.getInstance();
        myGlue.getInstance();
        myGlue.getInstance();
        expect(_.size(myGlue.instances)).toBe(3);

        myGlue.destroy();
        expect(_.size(myGlue.instances)).toBe(0);
    });
});
