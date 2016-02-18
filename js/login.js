var LoginForm = {

    init: function () {
        LoginForm._bindEvents();
        LoginForm._bindSubmit();
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

        $('#forgotPassword').click(function(element) {
            if ($(this).is(':checked')) {
                $('#passwordFieldGroup').hide();
                document.getElementById("continueButton").textContent="Recuperar senha";
                document.getElementById("title").textContent="Recuperar senha";
            } else {
                $('#passwordFieldGroup').show();
                document.getElementById("continueButton").textContent="Continuar";
                document.getElementById("title").textContent="Login";
            }
        });
    },

    _bindSubmit: function() {
        $('#continueButton').click(function() {
            var forgotPassword = $('#forgotPassword').is(':checked');
            if (forgotPassword) {
                LoginForm._forgotPasswordFlow();
            } else {
                LoginForm._subscriptionFlow();
            }
        });
    },

    _subscriptionFlow: function() {
         var hasErros = $('#inputPassword').val() === '' || $('#inputEmail').val() === '' ||
                         Validation.hasErros($('#inputEmail')) || Validation.hasErros($('#inputPassword'));

         if (!hasErros) {
            AccountSDK.signin(AccountProvider.STRIPE_BR, $('#inputEmail').val(), $('#inputPassword').val(), function(data) {
                if (data.success) {
                    $('#submitButton').click();
                } else {
                    $('.close').click();
                    $('form').prepend("<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Ops!</strong> As informações de login estão incorretas</div>");
                }
            });
         } else {
            $('.close').click();
            $('form').prepend("<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Ops!</strong> As informações de login estão incorretas</div>");
         }
    },

    _forgotPasswordFlow: function() {
        var hasErros = $('#inputEmail').val() === '' || Validation.hasErros($('#inputEmail'));
        if (hasErros) {
            $('form').prepend("<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Email inválido</div>");
        } else {
            AccountSDK.forgot(AccountProvider.STRIPE_BR, $('#inputEmail').val(), "PT", function (data) {
                if (data.success) {
                    $('form').prepend("<div class=\"alert alert-warning\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Verifique seu email e faça o login aqui</div>");
                    $('.close').click();
                    $('#forgotPassword').click();
                } else {
                    $('.close').click();
                    $('form').prepend("<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Email inválido</div>");
                }
            });
        }
    }
};

$(document).ready(
    function() {
        LoginForm.init()
    }
);

