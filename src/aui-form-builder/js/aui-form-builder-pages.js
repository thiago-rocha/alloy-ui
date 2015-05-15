
/**
 * The Form Builder Pages Builder Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-pages
 */

var CSS_FORM_BUILDER_ADD_PAGE =
        A.getClassName('form', 'builder', 'pages', 'add', 'page'),
    CSS_FORM_BUILDER_PAGE_CONTROLS = A.getClassName('form', 'builder', 'page', 'controls'),
    CSS_FORM_BUILDER_PAGES_CONTENT =
        A.getClassName('form', 'builder', 'pages', 'content'),
    CSS_FORM_BUILDER_REMOVE_PAGE =
        A.getClassName('form', 'builder', 'pages', 'remove', 'page'),
    CSS_FORM_BUILDER_PAGINATION = A.getClassName('form', 'builder', 'pagination'),
    CSS_PAGE_HEADER = A.getClassName('form', 'builder', 'page', 'header'),
    CSS_PAGE_HEADER_DESCRIPTION = A.getClassName('form', 'builder', 'page', 'header', 'description'),
    CSS_PAGE_HEADER_DESCRIPTION_HIDE_BORDER =
        A.getClassName('form', 'builder', 'page', 'header', 'description', 'hide', 'border');
    CSS_PAGE_HEADER_ICON = A.getClassName('form', 'builder', 'page', 'header', 'icon'),
    CSS_PAGE_HEADER_TITLE = A.getClassName('form', 'builder', 'page', 'header', 'title'),
    CSS_PAGE_HEADER_TITLE_HIDE_BORDER =
        A.getClassName('form', 'builder', 'page', 'header', 'title', 'hide', 'border');

/**
 * A base class for Form Builder Pages Builder.
 *
 * @class A.FormBuilderPages
 * @uses A.FormBuilderBuilder
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormBuilderPages = A.Base.create('form-builder-pages', A.Widget, [], {

    TPL_PAGES: '<div class="' + CSS_FORM_BUILDER_PAGES_CONTENT + '">' +
        '<div class="' + CSS_FORM_BUILDER_PAGINATION + '"></div>' +
        '<div class="' + CSS_FORM_BUILDER_PAGE_CONTROLS + '">' +
        '<a href="javascript:;" class="' + CSS_FORM_BUILDER_REMOVE_PAGE + ' glyphicon glyphicon-trash"></a>' +
        '<a href="javascript:;" class="' + CSS_FORM_BUILDER_ADD_PAGE + ' glyphicon glyphicon-plus"></a>' +
        '</div></div>',


    /**
     * Constructor for the `A.FormBuilderPages`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this.get('contentBox').append(this.TPL_PAGES);

        this._defaultTitlePlaceholderValue = 'Untitled Page';

    },

    /**
     * Renders the `A.FormBuilderPages` UI. Lifecycle.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function() {
        this._getPagination().render();
    },

    /**
     * Bind the events for the `A.FormBuilderPages` UI. Lifecycle.
     *
     * @method bindUI
     * @protected
     */
    bindUI: function() {
        var content = this.get('contentBox');

        content.one('.' + CSS_FORM_BUILDER_ADD_PAGE).on('click', A.bind(this._onAddPageClick, this));
        content.one('.' + CSS_FORM_BUILDER_REMOVE_PAGE).on('click', A.bind(this._onRemovePageClick, this));
        this.after('pagesQuantityChange', A.bind(this._afterPagesQuantityChange, this));
        this.after('activePageNumberChange', A.bind(this._afterActivePageNumberChange, this));
    },

    _afterActivePageNumberChange: function() {},

    /**
     *
     *
     * @method _afterPagesQuantityChange
     * @protected
     */
    _afterPagesQuantityChange: function() {
        this._uiSetPagesQuantity(this.get('pagesQuantity'));
    },

    /**
     * Creates pagination.
     *
     * @method _createPagination
     * @return {Node}
     * @protected
     */
    _createPagination: function() {
        return new A.Pagination({
            boundingBox: '.' + CSS_FORM_BUILDER_PAGINATION,
            on: {
                pageChange: A.bind(this._onCurrentPageChange, this)
            },
            page: this.get('activePageNumber'),
            strings: {
                prev: '&#xAB;',
                next: '&#xBB;'
            },
            total: this.get('pagesQuantity')
        });
    },

    /**
     * Returns the pagination instance.
     *
     * @method _getPagination
     * @return {A.Pagination}
     * @protected
     */
    _getPagination: function() {
        if (!this._pagination) {
            this._pagination = this._createPagination();
        }

        return this._pagination;
    },

    /**
     * Fired on add button clicked.
     *
     * @method _onAddPageClick
     * @protected
     */
    _onAddPageClick: function() {
        var quantity = this.get('pagesQuantity');

        this.set('pagesQuantity', quantity + 1);

        this.fire(
            'add', {
                quantity: quantity
            }
        );

        this._pagination.set('page', this.get('pagesQuantity'));
    },

    /**
     * Fired on current page change.
     *
     * @method _onCurrentPageChange
     * @protected
     */
    _onCurrentPageChange: function(event) {
        this.set('activePageNumber', event.newVal);
    },

    /**
     * Fired on remove button clicked.
     *
     * @method _onRemovePageClick
     * @protected
     */
    _onRemovePageClick: function() {
        var activePageNumber = this.get('activePageNumber'),
            page = Math.max(1, activePageNumber - 1);

        this._getPagination().prev();
        this.set('pagesQuantity', this.get('pagesQuantity') - 1);

        this.fire(
            'remove', {
                removedIndex: activePageNumber - 1
            }
        );

        this._pagination.set('page', page);

        // We need to improve aui-pagination. This should be done
        // automatically after the 'page' attribute is set.
        this._pagination.getItem(page).addClass('active');
    },

    /**
     * Updates the ui according to the value of the `pagesQuantity` attribute.
     *
     * @method _uiSetPagesQuantity
     * @protected
     */
    _uiSetPagesQuantity: function(total) {
        var pagination = this._getPagination();

        pagination.set('total', total);
    }
}, {
    ATTRS: {
        /**
         * Index of the current active page.
         *
         * @attribute activePageNumber
         * @default 1
         * @type {Number}
         */
        activePageNumber: {
            value: 1
        },

        /**
         * Total of pages.
         *
         * @attribute pagesQuantity
         * @default 0
         * @type {Number}
         */
        pagesQuantity: {
            value: 0
        }
    }
});
