var ActivateForm = {

    init: function () {
        ActivateForm._bindEvents();
        ActivateForm._bindSubmit();
    },

    _bindEvents: function() {
        $('#inputPhone').mask('(00) 0000-0000');
        $('#inputActivationCode').mask('000000');

        $('#inputPhone').keyup(function() {
            Validation.validate($(this), Validation._isNotEmpty);
            Validation.validate($(this), Validation._isInputNumeric);
        });
    },

    _bindSubmit: function() {
        $('#sendCode').click(function(){
            var activateCode = $('#inputActivationCode').val() == "";
            if(!activateCode){
                $('#submitButton').click();
            } else {
                $(this).html("Iniciar assinatura");
                $('.activateFieldGroup').css("display", "block");
            }
        });
    },

    _activateFlow: function() {
        // TODO
        var hasErros = false;
        if(hasErros){
            $('.close').click();
            $('form').prepend("<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Erro</div>");
        }
    },

};

$(document).ready(
    function() {
        ActivateForm.init()
    }
);

