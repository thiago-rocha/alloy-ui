/**
 * The Boolean Data Editor Component
 *
 * @module aui-validator-data-editor
 */

var CSS_VALIDATOR_DATA_EDITOR = A.getClassName('validator', 'data', 'editor'),
    CSS_VALIDATOR_DATA_EDITOR_ADD_RULE =
        A.getClassName('validator', 'data', 'editor', 'add', 'rule'),
    CSS_VALIDATOR_DATA_EDITOR_ERROR_TYPES =
        A.getClassName('validator', 'data', 'editor', 'error', 'types'),
    CSS_VALIDATOR_DATA_EDITOR_ERROR_TYPE =
        A.getClassName('validator', 'data', 'editor', 'error', 'type'),
    CSS_VALIDATOR_DATA_EDITOR_ERROR_VALUE =
        A.getClassName('validator', 'data', 'editor', 'error', 'value'),
    CSS_VALIDATOR_DATA_EDITOR_REMOVE =
        A.getClassName('validator', 'data', 'editor', 'remove'),
    CSS_VALIDATOR_DATA_EDITOR_ROW =
        A.getClassName('validator', 'data', 'editor', 'row'),
    CSS_VALIDATOR_DATA_EDITOR_RULES_ATTRIBUTE =
        A.getClassName('validator', 'data', 'editor', 'rules', 'attribute'),
    CSS_VALIDATOR_DATA_EDITOR_RULES_CONTAINER =
        A.getClassName('validator', 'data', 'editor', 'rules', 'container'),
    CSS_VALIDATOR_DATA_EDITOR_RULE_TYPE =
        A.getClassName('validator', 'data', 'editor', 'rule', 'type'),
    CSS_VALIDATOR_DATA_EDITOR_RULE_TYPES =
        A.getClassName('validator', 'data', 'editor', 'rule', 'types'),
    CSS_VALIDATOR_DATA_EDITOR_RULE_VALUE =
        A.getClassName('validator', 'data', 'editor', 'rule', 'value'),
    CSS_VALIDATOR_DATA_EDITOR_TEXT_HEADER =
        A.getClassName('validator', 'data', 'editor', 'text', 'header'),

    SOURCE_UI = 'ui';

/**
 * A base class for Boolean Data Editor.
 *
 * @class A.ValidatorDataEditor
 * @extends A.DataEditor
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.ValidatorDataEditor = A.Base.create('validator-data-editor', A.DataEditor, [], {
    TPL_EDITOR_CONTENT: '<div class="' + CSS_VALIDATOR_DATA_EDITOR + '">' +
        '<div class="' + CSS_VALIDATOR_DATA_EDITOR_TEXT_HEADER + '"></div>' +
        '<div class="' + CSS_VALIDATOR_DATA_EDITOR_RULES_CONTAINER + '"></div>' +
        '<a class="' + CSS_VALIDATOR_DATA_EDITOR_ADD_RULE +
        '" href="javascript:void(0)">Add new rule</a>' +
        '</div>',
    TPL_DEFAULT_RULE: {type: 'contains', value: '', error: { type: 'info', value: ''}},
    TPL_VALIDATOR_ROW: '<div class="' + CSS_VALIDATOR_DATA_EDITOR_ROW + '">' +
        '<select class="' + CSS_VALIDATOR_DATA_EDITOR_RULE_TYPES + ' ' +
        CSS_VALIDATOR_DATA_EDITOR_RULES_ATTRIBUTE + '">' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_RULE_TYPE +
                '" value="contains">Contains</option>' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_RULE_TYPE +
                '" value="doesNotContains">Does not contains</option>' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_RULE_TYPE +
                '" value="equals">Equals</option>' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_RULE_TYPE +
                '" value="isValidEmail">Is valid email</option>' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_RULE_TYPE +
                '" value="isValidURL">Is valid URL</option>' +
        '</select>' +
        '<input class="' + CSS_VALIDATOR_DATA_EDITOR_RULE_VALUE + ' ' +
            CSS_VALIDATOR_DATA_EDITOR_RULES_ATTRIBUTE + '" type="text"></input>' +
        '<select class="' + CSS_VALIDATOR_DATA_EDITOR_ERROR_TYPES + ' ' +
        CSS_VALIDATOR_DATA_EDITOR_RULES_ATTRIBUTE + '">' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_ERROR_TYPE +
                '" value="info">Info</option>' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_ERROR_TYPE +
                '" value="error">Error</option>' +
            '<option class="' + CSS_VALIDATOR_DATA_EDITOR_ERROR_TYPE +
                '" value="alert">Alert</option>' +
        '</select>' +
        '<input class="' + CSS_VALIDATOR_DATA_EDITOR_ERROR_VALUE + ' ' +
            CSS_VALIDATOR_DATA_EDITOR_RULES_ATTRIBUTE + '" type="text"></input>' +
        '<a class="' + CSS_VALIDATOR_DATA_EDITOR_REMOVE +
            '" href="javascript:void(0)">Remove</a></div>',

    /**
     * Constructor for the `A.ValidatorDataEditor`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var node = this.get('node');

        this._uiSetType(this.get('type'));
        this._uiSetEditedValue(this.get('editedValue'));

        node.one('.' + CSS_VALIDATOR_DATA_EDITOR_ADD_RULE).after('click',
            A.bind(this._afterClickAddButton, this));
        node.delegate('valuechange', A.bind(this._onRuleAttributeChange, this),
            '.' + CSS_VALIDATOR_DATA_EDITOR_RULES_ATTRIBUTE);

        node.delegate('click', A.bind(this._onClickRemoveButton, this),
            '.' + CSS_VALIDATOR_DATA_EDITOR_REMOVE);

        this.after('editedValueChange', this._afterEditedValueChange);
        this.after('typeChange', this._afterTypeChange);
    },

    /**
     * Fired after the button for adding rule is clicked.
     *
     * @method _afterClickAddButton
     * @protected
     */
    _afterClickAddButton: function() {
        var editedValue = this.get('editedValue');

        this.get('node').one('.' + CSS_VALIDATOR_DATA_EDITOR_RULES_CONTAINER).append(
            A.Node.create(A.Lang.sub(this.TPL_VALIDATOR_ROW)));

        editedValue.push(this.TPL_DEFAULT_RULE);
        this.set('editedValue', editedValue, {
            src: SOURCE_UI
        });
    },

    /**
     * Fired after the `editedValue` attribute is set.
     *
     * @method _afterEditedValueChange
     * @param {EventFacade} event
     * @protected
     */
    _afterEditedValueChange: function(event) {
console.log(this.get('editedValue'));
        if (event.src !== SOURCE_UI) {
            this._uiSetEditedValue(this.get('editedValue'));
        }
    },

    /**
     * Fired after the `type` attribute is set.
     *
     * @method _afterTypeChange
     * @protected
     */
    _afterTypeChange: function() {
        this._uiSetType(this.get('type'));
    },

    /**
     * Creates an rule node.
     *
     * @method _createRuleNode
     * @param {Object} rule
     * @return {Node}
     * @protected
     */
    _createRuleNode: function(rule) {
        var ruleNode = A.Node.create(A.Lang.sub(this.TPL_VALIDATOR_ROW));

        ruleNode.one('option[value="' + rule.type + '"]').setAttribute('selected', true);
        ruleNode.one('.' + CSS_VALIDATOR_DATA_EDITOR_RULE_VALUE).set('value', rule.value);
        ruleNode.one('option[value="' + rule.error.type + '"]').setAttribute('selected', true);
        ruleNode.one('.' + CSS_VALIDATOR_DATA_EDITOR_ERROR_VALUE).set('value', rule.error.value);

        return ruleNode;
    },

    /**
     * Gets the rule node's index in the rule list.
     *
     * @method _getRuleNodeIndex
     * @param {Node} node
     * @protected
     */
    _getRuleNodeIndex: function(node) {
        var ruleNode = node.ancestor('.' + CSS_VALIDATOR_DATA_EDITOR_ROW, true),
            ruleNodes = this.get('node').all('.' + CSS_VALIDATOR_DATA_EDITOR_ROW);

        return ruleNodes.indexOf(ruleNode);
    },

    /**
     * Fired when the value of one of the rule's attributes value changes.
     *
     * @method _onRuleAttributeChange
     * @param {EventFacade} event
     * @protected
     */
    _onRuleAttributeChange: function(event) {
        var currentNode = event.currentTarget.ancestor('.' + CSS_VALIDATOR_DATA_EDITOR_ROW),
            currentRule,
            editedValue = this.get('editedValue'),
            index = this._getRuleNodeIndex(currentNode);

        currentRule = editedValue[index];

        if (event.currentTarget.hasClass(CSS_VALIDATOR_DATA_EDITOR_RULE_TYPES)) {
            currentRule.type = event.currentTarget.get('value');
        }
        else if (event.currentTarget.hasClass(CSS_VALIDATOR_DATA_EDITOR_RULE_VALUE)) {
            currentRule.value = event.currentTarget.get('value');
        }
        else if (event.currentTarget.hasClass(CSS_VALIDATOR_DATA_EDITOR_ERROR_TYPES)) {
            currentRule.error.type = event.currentTarget.get('value');
        }
        else {
            currentRule.error.value = event.currentTarget.get('value');
        }

        editedValue[index] = currentRule;
        this.set('editedValue', editedValue, {
            src: SOURCE_UI
        });
    },

    /**
     * Fired when a button for removing an rule is clicked.
     *
     * @method _onClickRemoveButton
     * @param {EventFacade} event
     * @protected
     */
    _onClickRemoveButton: function(event) {
        var editedValue = this.get('editedValue'),
            index = this._getRuleNodeIndex(event.currentTarget),
            ruleNode = event.currentTarget.ancestor('.' + CSS_VALIDATOR_DATA_EDITOR_ROW);

        this._removeRuleNode(ruleNode);

        editedValue.splice(index, 1);
        this.set('editedValue', editedValue, {
            src: SOURCE_UI
        });
    },

    /**
     * Removes the given rule node.
     *
     * @method _removeRuleNode
     * @param {Node} ruleNode
     * @protected
     */
    _removeRuleNode: function(ruleNode) {
        ruleNode.remove();
    },

    /**
     * Updates the ui according to the value of the `type` attribute.
     *
     * @method _uiSetType
     * @param {String} type
     * @protected
     */
    _uiSetType: function(type) {
         this.get('node').one('.' + CSS_VALIDATOR_DATA_EDITOR_TEXT_HEADER).set('innerHTML',
            'Edit validations of type ' + type);
    },

    /**
     * Updates the ui according to the value of the `editedValue` attribute.
     *
     * @method _uiSetEditedValue
     * @param {Array} editedValue
     * @protected
     */
    _uiSetEditedValue: function(editedValue) {
        var instance = this,
            ruleContainer = this.get('node').one('.' + CSS_VALIDATOR_DATA_EDITOR_RULES_CONTAINER);

        A.Array.each(editedValue, function(rule) {
            ruleContainer.append(instance._createRuleNode(rule));
        });
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.ValidatorDataEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * The value after edition.
         *
         * @attribute editedValue
         * @default []
         * @type Object
         */
        editedValue: {
            value: []
        },

        /**
         * The value to be edited.
         *
         * @attribute originalValue
         * @default []
         * @type Object
         */
        originalValue: {
            value: []
        },

        /**
         * Type of current field.
         *
         * @attribute type
         * @type {String}
         */
        type: {
            value: 'text',
            writeOnce: 'initOnly'
        }
    }
});
