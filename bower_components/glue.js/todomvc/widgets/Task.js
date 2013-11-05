var TaskWidget = glue.createWidget()
    .extend({

        /**
         * Render view
         */
        render: function () {
            this.dom = this.renderTemplate("task");

            this._initEvents();
            this.refresh();

            return this.dom;
        },

        /**
         * Refresh
         */
        refresh: function () {
            this.find(".title").text(this.model.title);
            this.find(".done").prop('checked', this.model.done);
            this.dom.toggleClass('done', this.model.done);

        },

        /**
         * Edit mode
         */
        editMode: function () {
            this.dom.addClass('editing');
        },

        /**
         * Return to normal mode
         */
        normalMode: function () {
            this.dom.removeClass('editing');
            this.model.setTitle(this.find(".edit-box").val());
            this.model.save();
        },

        /**
         * Init view Events
         */
        _initEvents: function () {
            this.observer(['setTitle', 'setDone']);
            this.observer('setDone', this.model.save, this.model);

            var box = this.find(".edit-box");

            this.on("dblclick", function () {
                this.editMode();
                box.focus()
            });

            this.input(".done", this.model.setDone);

            this.on("blur", box, this.normalMode);
            this.on("keydown", box, function (event) {
                if (event.keyCode == 13) {
                    this.normalMode();
                }
            });

        }
    });