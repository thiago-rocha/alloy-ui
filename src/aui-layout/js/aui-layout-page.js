/**
 * The Layout Page Component
 *
 * @module aui-layout-page
 */
var CSS_PAGE = A.getClassName('layout', 'page'),
    CSS_PAGE_HEADER = A.getClassName('layout', 'page', 'header'),
    CSS_PAGE_HEADER_DESCRIPTION = A.getClassName('layout', 'page', 'header', 'description'),
    CSS_PAGE_HEADER_DESCRIPTION_HIDE_BORDER =
        A.getClassName('layout', 'page', 'header', 'description', 'hide', 'border'),
    CSS_PAGE_HEADER_TITLE = A.getClassName('layout', 'page', 'header', 'title'),
    CSS_PAGE_HEADER_TITLE_HIDE_BORDER =
        A.getClassName('layout', 'page', 'header', 'title', 'hide', 'border'),
    CSS_PAGE_ROWS_CONTAINER = A.getClassName('layout', 'page', 'rows', 'container');

var TPL_PAGE = '<div class="' + CSS_PAGE + '"><div class="' + CSS_PAGE_HEADER + ' form-inline">' +
        '<input placeholder="Untitle page" tabindex="1" class="' + CSS_PAGE_HEADER_TITLE + ' ' +
        CSS_PAGE_HEADER_TITLE_HIDE_BORDER + ' form-control" type="text" />' +
        '<input placeholder="An aditional info about this page" tabindex="2" class="' + CSS_PAGE_HEADER_DESCRIPTION + ' ' +
        CSS_PAGE_HEADER_DESCRIPTION_HIDE_BORDER + ' form-control" type="text" />' +
        '</div><div class="' + CSS_PAGE_ROWS_CONTAINER + '"></div></div>';

/**
 * A base class for Layout Page.
 *
 * @class A.LayoutPage
 * @extends Base
 * @param {Object} config Object literal specifying layout configuration
 *     properties.
 * @constructor
 */
A.LayoutPage = A.Base.create('layout-page', A.Base, [], {
    /**
     * Construction logic executed during `A.LayoutPage` instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var node = this.get('node');

        node.one('.' + CSS_PAGE_HEADER_DESCRIPTION).on('valuechange', A.bind(this._onDescriptionInputValueChange, this));
        node.one('.' + CSS_PAGE_HEADER_TITLE).on('valuechange', A.bind(this._onTitleInputValueChange, this));

        this.after({
            descriptionChange: this._afterDescriptionChange,
            rowsChange: this._afterRowsChange,
            titleChange: this._afterTitleChange
        });

        this._uiSetDescription(this.get('description'));
        this._uiSetRows(this.get('rows'));
        this._uiSetTitle(this.get('title'));
    },

    /**
     * Adds a new row to the current layout.
     *
     * @method addRow
     * @param {Number} index Position to insert the new row.
     * @param {Node} row A brand new row.
     */
    addRow: function(index, row) {
        var rows = this.get('rows').concat();

        if (A.Lang.isUndefined(index)) {
            index = rows.length;
        }

        if (!row) {
            row = new A.LayoutRow();
        }

        rows.splice(index, 0, row);

        this.set('rows', rows);
    },

    /**
     * Adds a new row with specified number of cols to the current layout.
     *
     * @method addRowWithSpecifiedColNumber
     * @param {Number} numberOfCols Number of cols to create the row with.
     */
    addRowWithSpecifiedColNumber: function(numberOfCols) {
        var cols = [],
            i,
            row,
            rows = this.get('rows').concat();

        numberOfCols = numberOfCols || 1;

        for (i = 0; i < numberOfCols; i++) {
            cols.push(new A.LayoutCol({ size: MAXIMUM_COLS_PER_ROW / numberOfCols }));
        }

        row = new A.LayoutRow({ cols: cols });

        rows.splice(rows.length, 0, row);

        this.set('rows', rows);
    },

    /**
     * Moves a row to a different position.
     *
     * @method moveRow
     * @param {Number} index The new position of the row.
     * @param {Node} row Row to change the position.
     */
    moveRow: function(index, row) {
        this.removeRow(row);
        this.addRow(index, row);
    },

    /**
     * Removes a row from this layout.
     *
     * @method removeRow
     * @param {Number | A.LayoutRow} row Row index or row to be removed from this layout
     */
    removeRow: function(row) {
        if (A.Lang.isNumber(row)) {
            this._removeRowByIndex(row);
        }
        else if (A.instanceOf(row, A.LayoutRow)) {
            this._removeRowByReference(row);
        }
    },

    /**
     * Fired after the `description` attribute changes.
     *
     * @method _afterDescriptionChange
     * @param {EventFacade} event
     * @protected
     */
    _afterDescriptionChange: function(event) {
        this._uiSetDescription(event.newVal);
    },

    /**
     * Fired after the `rows` attribute changes.
     *
     * @method _afterRowsChange
     * @param {EventFacade} event
     * @protected
     */
    _afterRowsChange: function(event) {
        this._uiSetRows(event.newVal);
    },

    /**
     * Fired after the `ttile` attribute changes.
     *
     * @method _afterTitleChange
     * @protected
     */
    _afterTitleChange: function(event) {
        this._uiSetTitle(event.newVal);
    },

    /**
     * Fired on input value change.
     *
     * @method _onTitleInputValueChange
     * @protected
     */
    _onDescriptionInputValueChange: function(event) {
        this.set('description', event.newVal);
    },

    /**
     * Fired on input value change.
     *
     * @method _onTitleInputValueChange
     * @protected
     */
    _onTitleInputValueChange: function(event) {
        this.set('title', event.newVal);
    },

    /**
     * Sets the `rows` attribute.
     *
     * @method _setRows
     * @param {Array} val
     * @protected
     */
    _setRows: function(val) {
        var i,
            newVal = [],
            row;

        for (i = 0; i < val.length; i++) {
            row = val[i];
            if (!A.instanceOf(row, A.LayoutRow)) {
                row = new A.LayoutRow(row);
            }

            newVal.push(row);
        }

        return newVal;
    },

    /**
     * Updates the UI according to the value of the `description` attribute.
     *
     * @method _uiSetDescription
     * @param {String} description
     * @protected
     */
    _uiSetDescription: function(description) {
        this.get('node').one('.' + CSS_PAGE_HEADER_DESCRIPTION).val(description);
    },

    /**
     * Updates the UI according to the value of the `rows` attribute.
     *
     * @method _uiSetRows
     * @param {Array} rows
     * @protected
     */
    _uiSetRows: function(rows) {
        var node = this.get('node'),
            rowsContainerNode = node.one('.' + CSS_PAGE_ROWS_CONTAINER);

        rowsContainerNode.empty();
        A.each(rows, function(row) {
            rowsContainerNode.append(row.get('node'));
        });
    },

    /**
     * Updates the UI according to the value of the `title` attribute.
     *
     * @method _uiSetTitle
     * @param {String} title
     * @protected
     */
    _uiSetTitle: function(title) {
        this.get('node').one('.' + CSS_PAGE_HEADER_TITLE).val(title);
    }
}, {

    /**
     * Static property used to define the default attribute
     * configuration for the Layout Page.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * The page description.
         *
         * @attribute description
         * @type {String}
         */
        description: {
            value: ''
        },

        /**
         * The node where this column will be rendered.
         *
         * @attribute node
         * @type Node
         */
        node: {
            setter: function(val) {
                val.setData('layout-page', this);
                return val;
            },
            validator: A.Lang.isNode,
            valueFn: function() {
                return A.Node.create(TPL_PAGE);
            },
            writeOnce: 'initOnly'
        },

        /**
         * Rows to be appended into container node
         *
         * @attribute rows
         * @type {Array}
         */
        rows: {
            setter: '_setRows',
            validator: A.Lang.isArray,
            value: []
        },

        /**
         * The title of a page.
         *
         * @attribute title
         * @default true
         * @type {String}
         */
        title: {
            value: ''
        }
    }
});
