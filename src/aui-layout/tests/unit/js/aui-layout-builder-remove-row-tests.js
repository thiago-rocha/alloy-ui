YUI.add('aui-layout-builder-remove-row-tests', function(Y) {

    var Assert = Y.Assert,
        container,
        layout,
        suite = new Y.Test.Suite('aui-layout-builder-remove-row');

    suite.add(new Y.Test.Case({
        name: 'Layout Builder Remove Row Tests',

        setUp: function() {

            layout = new Y.Layout({
                rows: [
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            })
                        ]
                    }),
                    new Y.LayoutRow()
                ]
            });

            this.layoutBuilder = new Y.LayoutBuilder({
                container: Y.one('.container'),
                layout: layout
            });

            container = this.layoutBuilder.get('container');
        },

        tearDown: function() {
            this.layoutBuilder.destroy();
        },

        'should add remove button for each row': function() {
            var removeButtons = container.all('.layout-builder-remove-row-button');

            Assert.areEqual(2, removeButtons.size());
        },

        'should update buttons after layout changes': function() {
            var removeButtons;

            this.layoutBuilder.set('layout', new Y.Layout({
                rows: [
                    new Y.LayoutRow(),
                    new Y.LayoutRow(),
                    new Y.LayoutRow()
                ]
            }));

            removeButtons = container.all('.layout-builder-remove-row-button');
            Assert.areEqual(3, removeButtons.size());
        },

        'should update buttons after layout rows change': function() {
            var removeButtons;

            this.layoutBuilder.get('layout').addRow(new Y.LayoutRow());

            removeButtons = container.all('.layout-builder-remove-row-button');
            Assert.areEqual(3, removeButtons.size());
        },

        'should remove a new row when click on remove row button': function() {
            var button = container.one('.layout-builder-remove-row-button'),
                rows = container.all('.row');

            Assert.areEqual(2, rows.size());

            button.simulate('click');

            rows = container.all('.row');

            Assert.areEqual(1, rows.size());
        },

        'should hide remove row button if disable enableRemoveRows attribute': function() {
            var button = container.one('.layout-builder-remove-row-button');

            Assert.isNotNull(button);

            this.layoutBuilder.set('enableRemoveRows', false);

            button = container.one('.layout-builder-remove-row-button');

            Assert.isNull(button);
        },

        'should disable enableRemoveRows attribute when creating the layout builder': function() {
            var button;

            this.layoutBuilder.destroy();

            this.layoutBuilder = new Y.LayoutBuilder({
                container: Y.one('.container'),
                enableRemoveRows: false,
                layout: layout
            });

            button = container.one('.layout-builder-remove-row-button');

            Assert.isNull(button);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-layout-builder', 'aui-classnamemanager', 'node-event-simulate']
});
