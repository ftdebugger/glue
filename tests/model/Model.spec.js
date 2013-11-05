describe('Model', function(){

    it('should be created and have all necessary methods', function(){
        var Model = glue.createModel();
        expect(typeof Model).toBe("function");
        expect(typeof Model.setter).toBe("function");
        expect(typeof Model.getter).toBe("function");
        expect(typeof Model.accessor).toBe("function");
        expect(typeof Model.extend).toBe("function");
        expect(typeof Model.attachModel).toBe("function");
        expect(typeof Model.detachModel).toBe("function");
    });

    it('should be instantiate as class and as factory', function(){
        var Model = glue.createModel();
        expect(new Model() instanceof Model).toBe(true);
        expect(Model() instanceof Model).toBe(true);
    });

    it("should add to collection, when instantiate", function(){
        var Model = glue.createModel();
        Model.setter("value");

        expect(Model.models.length).toBe(0);
        var model = new Model();

        expect(Model.models.length).toBe(1);
        expect(Model.models[0]).toBe(model);
    });

    it("should remove from collection, when destroy", function(){
        var Model = glue.createModel();

        var model = new Model();
        expect(Model.models.length).toBe(1);
        model.destroy();
        expect(Model.models.length).toBe(0);
    });

    it("should have lazy glue", function(){
        var Model = glue.createModel();
        var model = new Model();

        expect(typeof model.glue).toBe("undefined");
        expect(typeof model.getGlue()).not.toBe("undefined");
        expect(typeof model.glue).not.toBe("undefined");
    });

    it("shout destroy lazy glue, when destroy model", function(){
        var Model = glue.createModel();
        var model = new Model();
        var myGlue = model.glue = jasmine.createSpyObj('glue', ['destroy']);
        model.destroy();

        expect(model.glue).toBe(null);
        expect(myGlue.destroy).toHaveBeenCalled();
    });

    it("should create setter", function(){
        var Model = glue.createModel();
        Model.setter("value");

        var model = new Model();
        expect(typeof model.setValue).toBe("function");
        expect(model.setValue("abc")).toBe(model);
        expect(model.value).toBe("abc");
    });

    it("should create getter", function(){
        var Model = glue.createModel();
        Model.getter("value");

        var model = new Model();
        model.value = 'abc';

        expect(typeof model.getValue).toBe("function");
        expect(model.getValue()).toBe("abc");
    });

    it("should create accessor", function(){
        var Model = glue.createModel();
        Model.accessor("value");

        var model = new Model();

        expect(model.setValue("abc")).toBe(model);
        expect(model.getValue()).toBe("abc");
    });

    it("should create multi accessor", function(){
        var Model = glue.createModel();
        Model.accessor(["value_a", "value_b"]);

        var model = new Model();

        expect(typeof model.getValueA).toBe("function");
        expect(typeof model.getValueB).toBe("function");
        expect(typeof model.setValueA).toBe("function");
        expect(typeof model.setValueB).toBe("function");
    });

});