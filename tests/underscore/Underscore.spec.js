describe("underscore", function(){

    it("should add new methods to model", function(){
        var Model = glue.createModel();
        expect(Model.each).toBeDefined();
        expect(Model.map).toBeDefined();
    });

    it("should work as proxy for models variables", function(){
        var Model = glue.createModel();
        expect(Model.size()).toBe(0);
        var a = new Model();
        expect(Model.size()).toBe(1);
    });

});