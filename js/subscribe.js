var SubscribeForm = {

    init: function () {
        SubscribeForm._bindEvents();
        SubscribeForm._bindSubmit();
    },

    _bindEvents: function() {
        $('#inputEmail').keyup(function() {
            Validation.validate($(this), Validation._isNotEmpty);
            Validation.validate($(this), Validation._isEmail);
        });

        $('#inputPassword').keyup(function() {
            Validation.validate($(this), Validation._isNotEmpty);
            Validation.validate($(this), Validation._isPassword);
        });
    },

    _bindSubmit: function() {
        $('#continueButton').click(function() {
            var hasErros = $('#inputPassword').val() === '' || $('#inputEmail').val() === '' ||
                Validation.hasErros($('#inputEmail')) || Validation.hasErros($('#inputPassword'));

            if (!hasErros) {
                AccountSDK.signup(AccountProvider.STRIPE_BR, $('#inputEmail').val(), $('#inputPassword').val(), function(data) {
                    if (data.success) {
                        $('.close').click();
                        $('#submitButton').click();
                    } else {
                        $('form').prepend("<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Ops!</strong> Preencha este campo corretamente =)</div>");
                    }
                });
            } else {
                $('form').prepend("<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Ops!</strong> Preencha este campo corretamente =)</div>");
            }
        });
    }
};

$(document).ready(
    function() {
        SubscribeForm.init()
    }
);

