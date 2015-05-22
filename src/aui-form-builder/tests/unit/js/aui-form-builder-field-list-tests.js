YUI.add('aui-form-builder-field-type-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-builder-field-type');

    suite.add(new Y.Test.Case({
        name: 'AUI Form Builder Field Type Unit Tests',

        init: function() {
            this._container = Y.one('#container');
        },

        setUp: function() {
            this.createFormBuilder({});
        },

        tearDown: function() {
            this._fieldType && this._fieldType.destroy();
        },

        createFormBuilder: function(config) {
            this._fieldType = new Y.FormBuilderFieldType(config);
            this._container.append(this._fieldType.get('node'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-form-builder-field-type', 'node-event-simulate', 'test'],
    test: function(Y) {
        return Y.UA.ie === 0 || Y.UA.ie > 8;
    }
});
