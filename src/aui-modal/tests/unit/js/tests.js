YUI.add('aui-modal-tests', function(Y) {

    //--------------------------------------------------------------------------
    // Modal Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-modal'),
        modal,
        boundingBox,

        CSS_MODAL_OPEN = Y.getClassName('modal-open'),

        ERROR_PLUGIN_AVAILABLE = '{0} plugin should not be available',
        ERROR_PLUGIN_MISSING = '{0} plugin was not plugged',
        ERROR_PLUGIN_OVERRIDEN = '{0} attribute should not be overriden',
        ERROR_PLUGIN_PLUGGED = '{0} plugin should not be already plugged',

        TOUCH_ENABLED = Y.UA.touchEnabled,

        win = Y.one(Y.config.win);

    //--------------------------------------------------------------------------
    // Test Case for Plug/Unplug
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'Plug/Unplug',

        setUp: function() {
            if (modal) {
                modal.destroy();
            }

            modal = new Y.Modal().render('#modal');
            boundingBox = modal.get('boundingBox');
        },

        tearDown: function() {
            modal.destroy();

            modal = null;
            boundingBox = null;
        },

        //----------------------------------------------------------------------
        // Tests
        //----------------------------------------------------------------------

        'toggle drag functionality': function() {
            if (!TOUCH_ENABLED) {
                Y.Assert.isUndefined(
                    modal.dd,
                    Y.Lang.sub(ERROR_PLUGIN_OVERRIDEN, ['dd']));
                Y.Assert.isUndefined(
                    modal.hasPlugin('dd'),
                    Y.Lang.sub(ERROR_PLUGIN_PLUGGED, ['dd']));

                boundingBox.simulate('click');
            }

            Y.Assert.isNotUndefined(
                modal.hasPlugin('dd'),
                Y.Lang.sub(ERROR_PLUGIN_MISSING, ['dd']));

            modal.set('draggable', false);
            Y.Assert.isUndefined(
                modal.hasPlugin('dd'),
                Y.Lang.sub(ERROR_PLUGIN_AVAILABLE, ['dd']));

            modal.set('draggable', true);
            if (!TOUCH_ENABLED) {
                Y.Assert.isUndefined(
                    modal.hasPlugin('dd'),
                    Y.Lang.sub(ERROR_PLUGIN_PLUGGED, ['dd']));

                boundingBox.simulate('click');
            }

            Y.Assert.isNotUndefined(
                modal.hasPlugin('dd'),
                Y.Lang.sub(ERROR_PLUGIN_MISSING, ['dd']));
        }

    }));

    //--------------------------------------------------------------------------
    // Test Case for Events
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'Events',

        setUp: function() {
            if (modal) {
                modal.destroy();
            }

            modal = new Y.Modal().render('#modal');

            boundingBox = modal.get('boundingBox');
        },

        tearDown: function() {
            modal.destroy();

            modal = null;
            boundingBox = null;
        },

        //----------------------------------------------------------------------
        // Tests
        //----------------------------------------------------------------------

        'listen after visibleChange with destroyOnHide enabled': function() {
            var mock = new Y.Mock();

            Y.Mock.expect(
                mock, {
                    args: [YUITest.Mock.Value.Object],
                    method: 'afterVisibleChange'
                }
            );

            modal.after('visibleChange', mock.afterVisibleChange);

            modal.set('destroyOnHide', true);
            modal.hide();

            Y.Mock.verify(mock);
        }

    }));

    //--------------------------------------------------------------------------
    // Test Case for Scroll
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'Scroll',

        setUp: function() {
            if (modal) {
                modal.destroy();
            }

            modal = new Y.Modal().render('#modal');

            boundingBox = modal.get('boundingBox');
        },

        tearDown: function() {
            modal.destroy();

            modal = null;
            boundingBox = null;
        },

        _mockWindowInnerHeight: function(size) {
            Y.Mock.expect(Y.DOM, {
                args: [Y.Mock.Value.Object],
                method: 'winHeight',
                returns: size
            });
        },

        //----------------------------------------------------------------------
        // Tests
        //----------------------------------------------------------------------

        'check modal-open class after visibleChange': function() {
            var elements = Y.all('body,html');

            modal.show();

            var modalOpen = elements.hasClass(CSS_MODAL_OPEN);

            Y.Assert.isTrue(modalOpen[0]);
            Y.Assert.isTrue(modalOpen[1]);

            modal.hide();

            modalOpen = elements.hasClass(CSS_MODAL_OPEN);

            Y.Assert.isFalse(modalOpen[0]);
            Y.Assert.isFalse(modalOpen[1]);
        },

        'check if the modal is top fixed': function() {
            modal.set('headerContent', '<h4 class="modal-title">Modal header</h4>');
            modal.set('centered', true);
            modal.set('topFixed', true);

            modal.show();

            Y.Assert.areEqual(modal.get('boundingBox').getStyle('top'), '0px');
        },

        'check if the modal is dynamic content height configured': function() {
            if (modal) {
                modal.destroy();
            }

            modal = new Y.Modal({ dynamicContentHeight: true }).render('#modal');

            modal.show();

            Y.Assert.isTrue(modal.get('boundingBox').hasClass('dynamic-content-height'));
        },

        'check if the modal realigns on topFixed toggle': function() {
            var firstTopInfo;

            modal.set('centered', true);
            modal.set('topFixed', false);

            firstTopInfo = modal.get('boundingBox').get('region').top;

            modal.set('topFixed', true);

            Y.Assert.isTrue(firstTopInfo > modal.get('boundingBox').get('region').top);
        },

        'check if the modal is totally visible after resize': function() {
            var modalOuterHeight,
                content = '';

            for (var i = 60; i--; ) {
                content += 'Body content... ';
            }

            modal.set('headerContent', '<h4 class="modal-title">Modal header</h4>');
            modal.set('centered', true);
            modal.set('topFixed', true);
            modal.set('dynamicContentHeight', true);
            modal.set('bodyContent', content);

            modal.render();
            modal.show();

            this._mockWindowInnerHeight(200);

            win.simulate('resize');

            this.wait(function() {
                modalOuterHeight = modal.get('boundingBox').get('offsetHeight') +
                    parseInt(modal.get('boundingBox').getComputedStyle('marginTop')) +
                    parseInt(modal.get('boundingBox').getComputedStyle('marginBottom'));

                Y.Assert.areEqual(200, modalOuterHeight);
            }, Y.config.windowResizeDelay || 100);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-modal', 'aui-node-base', 'node-event-simulate', 'test']
});
