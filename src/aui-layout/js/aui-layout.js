/**
 * The Layout Component
 *
 * @module aui-layout
 */

var CSS_LAYOUT_NODE = A.getClassName('layout', 'node'),

    MAXIMUM_COLS_PER_ROW = 12,

    RESPONSIVENESS_BREAKPOINT = 992,

    SELECTOR_COL = '.col',
    SELECTOR_LAYOUT_COL_CONTENT = '.layout-col-content',
    SELECTOR_LAYOUT_ROW_CONTAINER_ROW = '.layout-row-container-row',
    SELECTOR_ROW = '.row';
    SELECTOR_PAGE = '.layout-page';

/**
 * A base class for Layout.
 *
 * @class A.Layout
 * @extends Base
 * @param {Object} config Object literal specifying layout configuration
 *     properties.
 * @constructor
 */
A.Layout = A.Base.create('layout', A.Base, [], {

    /**
     * Determines if progressive enhancement mode will be used.
     *
     * @property _useProgressiveEnhancement
     * @type {Boolean}
     * @protected
     */
    _useProgressiveEnhancement: false,

    /**
     * Construction logic executed during Layout instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function(config) {

        if (!config || !config.rows) {
            this._useProgressiveEnhancement = true;
        }

        this._eventHandles = [
            this.after('pagesChange', A.bind(this._afterPagesChange, this)),
            this.after('layout-row:colsChange', A.bind(this._afterLayoutColsChange, this)),
            this.after('layout-col:valueChange', A.bind(this._afterLayoutValueChange, this)),
            A.on('windowresize', A.bind(this._afterLayoutWindowResize, this))
        ];

        A.Array.invoke(this.get('pages'), 'addTarget', this);

        this._uiSetPages(this.get('pages'));
    },

    /**
     * Destructor implementation for the `A.Layout` class. Lifecycle.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        (new A.EventHandle(this._eventHandles)).detach();
    },

    /**
     * Renders the layout rows and columns into the given container.
     *
     * @method draw
     * @param {Node} container The container to draw the layout on.
     */
    draw: function(container) {
        var layoutNode = container.one('.' + CSS_LAYOUT_NODE),
            node = this.get('node');

        if (this._useProgressiveEnhancement && layoutNode) {
            this._set('node', layoutNode);
            this._setProgressiveEnhancementLayout(container);
        }
        else {
            container.setHTML(node);
        }

        this._handleResponsive(A.config.win.innerWidth);
    },

    /**
     * Normalize all cols' height for each row.
     *
     * @method normalizeColsHeight
     * @param {NodeList} rows Rows to normalize cols' height.
     */
    normalizeColsHeight: function(rows) {
        var instance = this,
            colClientHeight,
            cols,
            highestCol = 0;

        rows.each(function(row) {
            cols = row.all(SELECTOR_COL);

            if (instance.get('isColumnMode')) {
                if (row.getData('layout-row').get('equalHeight')) {
                    A.Array.invoke(cols, 'setStyle', 'height', 'auto');
                    cols.each(function(col) {
                        colClientHeight = col.get('clientHeight');

                        if (colClientHeight > highestCol) {
                            highestCol = colClientHeight;
                        }
                    });

                    A.Array.invoke(cols, 'setStyle', 'height', highestCol + 'px');
                    highestCol = 0;
                }
            }
            else {
                A.Array.invoke(cols, 'setStyle', 'height', 'auto');
            }
        });
    },

    /**
     * Fires after `layout-row:colsChange` event.
     *
     * @method _afterLayoutColsChange
     * @protected
     */
    _afterLayoutColsChange: function(event) {
        var row = event.target;

        this.normalizeColsHeight(new A.NodeList(row.get('node').one(SELECTOR_ROW)));
    },

    /**
     * Fires after cols' valueChange event.
     *
     * @method _afterLayoutValueChange
     * @protected
     */
    _afterLayoutValueChange: function(event) {
        var col = event.target,
            targets;

        targets = A.Array.filter(col.getTargets(), function(target) {
            if (target.name === 'layout-row') {
                return target;
            }
        });

        this.normalizeColsHeight(new A.NodeList(targets[0].get('node').one(SELECTOR_ROW)));
    },

    /**
     * Fires after rows changes.
     *
     * @method _afterPagesChange
     * @param {EventFacade} event
     * @protected
     */
    _afterPagesChange: function(event) {
        A.Array.invoke(event.prevVal, 'removeTarget', this);
        A.Array.invoke(event.newVal, 'addTarget', this);

        this._uiSetPages(this.get('pages'));
    },

    /**
     * Fires after window's resize.
     *
     * @method _afterLayoutWindowResize
     * @param {EventFacade} event
     * @protected
     */
    _afterLayoutWindowResize: function(event) {
        var viewportSize = event.target.get('innerWidth');
        this._handleResponsive(viewportSize);
    },


    /**
     * Create LayoutCol objects to use with progressive enhancement
     *
     * @method _createLayoutCols
     * @param {Array} cols
     * @protected
     */
    _createLayoutCols: function(cols) {
        var bootstrapClassRegex = /col-\w+-\d+/,
            colClass,
            colSizeRegex = /\d$/,
            layoutCols = [];

        cols.each(function(col) {
            colClass = col.get('className').match(bootstrapClassRegex)[0];

            layoutCols.push(new A.LayoutCol(
                {
                    size: A.Number.parse(colClass.match(colSizeRegex)[0]),
                    value: { content: col.one(SELECTOR_LAYOUT_COL_CONTENT).getHTML() }
                }
            ));
        });

        return layoutCols;
    },

    /**
     * Calculates column mode.
     *
     * @method _handleResponsive
     * @param {Number} viewportSize
     * @protected
     */
    _handleResponsive: function(viewportSize) {
        var enableColumnMode = viewportSize >= RESPONSIVENESS_BREAKPOINT;

        if (this.get('isColumnMode') !== enableColumnMode) {
            this._set('isColumnMode', enableColumnMode);

            this.normalizeColsHeight(this.get('node').all(SELECTOR_ROW));
        }
    },

    /**
     * Removes a row from this layout by it's index.
     *
     * @method _removeRowByIndex
     * @param {Number} index Row index to be removed from this layout
     * @protected
     */
    _removeRowByIndex: function(index) {
        var rows = this.get('rows').concat();

        rows.splice(index, 1);
        this.set('rows', rows);
    },

    /**
     * Removes a row from this layout by it's reference.
     *
     * @method _removeRowByReference
     * @param {A.LayoutRow} row Column to be removed from this layout
     * @protected
     */
    _removeRowByReference: function(row) {
        var index,
            rows = this.get('rows').concat();

        index = A.Array.indexOf(rows, row);

        if (index >= 0) {
            this._removeRowByIndex(index);
        }
    },

    /**
     * Builds layout through progressive enhancement
     *
     * @method _setProgressiveEnhancementLayout
     * @param {Node} container Node to append the layout
     * @protected
     */
    _setProgressiveEnhancementLayout: function(container) {
        var instance = this,
            layoutCols = [],
            layoutPages = [],
            layoutPage,
            layoutRow,
            layoutRows = [];

        container.all(SELECTOR_PAGE).each(function(page) {
            page.all(SELECTOR_ROW).each(function(row) {
                layoutCols = instance._createLayoutCols(page.all(SELECTOR_COL));

                layoutRow = new A.LayoutRow(
                    {
                        cols: layoutCols,
                        node: page.ancestor(SELECTOR_LAYOUT_ROW_CONTAINER_ROW)
                    }
                );

                layoutCols = [];

                layoutRows.push(layoutRow);
            });

            layoutPage = new A.LayoutPage(
                {
                    rows: layoutRows
                }
            );

            layoutRows = [];

            layoutPages.push(layoutPages);
        });

        this.set('pages', layoutPages);
    },

    /**
     * Sets the `pages` attribute.
     *
     * @method _setPages
     * @param {Array} val
     * @protected
     */
    _setPages: function(val) {
        var i,
            newVal = [],
            page;

        for (i = 0; i < val.length; i++) {
            page = val[i];
            if (!A.instanceOf(page, A.LayoutPage)) {
                page = new A.LayoutPage(page);
            }

            newVal.push(page);
        }

        return newVal;
    },

    /**
     * Updates the UI according to the value of the `pages` attribute.
     *
     * @method _uiSetPages
     * @param {Array} pages
     * @protected
     */
    _uiSetPages: function(pages) {
        var node = this.get('node');

        node.empty();
        A.each(pages, function(page) {
            node.append(page.get('node'));
        });
    }
}, {

    /**
     * Static property used to define the default attribute
     * configuration for the Layout.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Determines if columns should collapse.
         *
         * @property isColumnMode
         * @type {Boolean}
         * @protected
         */
        isColumnMode: {
            readOnly: true,
            validator: A.Lang.isBoolean,
            value: false
        },

        /**
         * The node where this column will be rendered.
         *
         * @attribute node
         * @type Node
         */
        node: {
            validator: A.Lang.isNode,
            valueFn: function() {
                return A.Node.create('<div class="' + CSS_LAYOUT_NODE + '"></div>');
            },
            writeOnce: 'initOnly'
        },

        /**
         * Pages to be appended into container node
         *
         * @attribute pages
         * @type {Array}
         */
        pages: {
            setter: '_setPages',
            validator: A.Lang.isArray,
            value: []
        }
    }
});
