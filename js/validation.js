var Validation = {

    _ERRO_CLASS: 'has-error',
    init: function() {
        Validation._bindPopupOK();
        Validation._hidePopup();
    },

    hasErros: function(field) {
        return field.hasClass(Validation._ERRO_CLASS);
    },

    validate: function(field, func) {
        var result,
            parent;

        if (func(field.val())) {
            if (field.hasClass(Validation._ERRO_CLASS)) {
                field.removeClass(Validation._ERRO_CLASS);
            }
            result = true;
        } else {
            if (!field.hasClass(Validation._ERRO_CLASS)) {
                field.addClass(Validation._ERRO_CLASS);
            }
            result = false;
        }
        return result;
    },

    _isNotEmpty: function(value) {
        return value.length > 0;
    },

    _isCVV: function(value) {
        var regex = new RegExp('^[0-9]{3,4}$');
        return regex.test(value);
    },

    _isPassword: function(value) {
        return value.length >= 6;
    },

    _isEmail: function(email) {
        var regex = /^.*@.*\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return regex.test(email);
    },

    _isInputNumeric: function(event) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A, Command+A
            (event.keyCode == 65 && ( event.ctrlKey === true || event.metaKey === true ) ) ||
                // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return false;
        }
        // Ensure that it is a number and stop the keypress
        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
        return true;
    }
};