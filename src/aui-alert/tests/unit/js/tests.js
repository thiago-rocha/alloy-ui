YUI.add('aui-alert-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('aui-alert'),
        alert1 = new Y.Alert({
                destroyOnHide: true,
                render: true,
                srcNode: '#info'
            }),
        alert2 = new Y.Alert({
                closeable: false,
                render: true,
                srcNode: '#danger'
            })
        alert3 = new Y.Alert({
                animated: true,
                bodyContent: 'Thank You Mario! But Our Princess Is In That Castle!',
                boundingBox: '#warning',
                closeable: true,
                cssClass: 'alert-warning',
                destroyOnHide: false,
                duration: 1,
                render: true
            });

    suite.add(new Y.Test.Case({

        'should set attributes': function() {
            Assert.areEqual(alert1.get('closeableNode'), Y.one('.close'));
            Assert.isTrue(alert1.get('destroyOnHide'));
            Assert.isFalse(alert2.get('closeable'));
        },

        'should not be the "close" button on DOM when closeable is false': function() {
            alert1.set('closeable', false);
            alert3.set('closeable', false);
            Assert.isNull(Y.one('#info .close'));
            Assert.isNull(Y.one('#danger .close'));
            Assert.isNull(Y.one('#warning .close'));
            alert1.set('closeable', true);
            alert3.set('closeable', true);
        },

        'should not close when click on close button with closeable false': function() {
            var closeNode = Y.one('.close');

            alert1.set('closeable', false);
            closeNode.simulate('click');

            closeNode.on('click', function() {
                Assert.isNotNull(Y.one('#info'));
            });

            alert1.set('closeable', true);
        },

        'should hide when clicked on close button': function() {
            var closeNode = Y.one('#info .close');

            closeNode.simulate('click');

            closeNode.on('click', function() {
                Assert.isFalse(alert1.get('visible'));
            });
        },

        'should destroy when clicked on close button and destroyOnHide as true': function() {
            var closeNode = Y.one('.close');

            alert1.set('destroyOnHide', true);
            closeNode.simulate('click');

            closeNode.on('click', function() {
                Assert.isNull(Y.one('#info'));
            });
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-alert', 'node-screen', 'node-event-simulate']
});
