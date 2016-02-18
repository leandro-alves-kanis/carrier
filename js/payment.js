var PaymentForm = {

    init: function () {
        PaymentForm._bindEvents();
        PaymentForm._bindSubmit();
    },

    _bindEvents: function() {
        $('.cc-number').payment('formatCardNumber');
        $('.cc-exp').payment('formatCardExpiry');
        $('.cc-cvc').payment('formatCardCVC');
    },

    _bindSubmit: function() {
        $('#continueButton').click(function() {

            var number = $("#inputCard").val(),
                cvv =  $("#inputCvc").val(),
                expMonth = $('#inputExp').payment('cardExpiryVal').month,
                expYear =  $('#inputExp').payment('cardExpiryVal').year,
                hasErros = !$.payment.validateCardNumber(number) ||
                           !$.payment.validateCardCVC(cvv) ||
                           !$.payment.validateCardExpiry(expMonth, expYear);

            if (hasErros) {
                $('form').prepend('<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Ops!</strong> Preencha os campos corretamente =)</div>');
            } else {
                var data = {number: number, cvc: cvv, exp_month: expMonth, exp_year: expYear};

                Stripe.setPublishableKey(AccountSDK.getTokenKey(AccountProvider.STRIPE_BR));
                Stripe.card.createToken(data, PaymentForm._subscribeWithHash);
            }
        });
    },

    _planId: function() {
        var planName = $('#plan').val()
        if (planName === 'mensal') {
            return 673;
        } else if (planName === 'anual') {
            return 675;
        } else if (planName === 'semestral') {
            return 674;
        }
        return null;
    },

    _subscribeWithHash: function(status, response) {
        if(status != 200 || response.error) {

            // translate
            if (response.error) {
                if(response.error.code == "invalid_number"){
                    response.error.message = "O ano de expiração do cartão é inválido.";
                } else if(response.error.code == "invalid_expiry_month"){
                    response.error.message = "O mês de vencimento do cartão é inválido.";
                } else if(response.error.code == "invalid_expiry_year"){
                    response.error.message = "O ano de expiração do cartão é inválido.";
                } else if(response.error.code == "invalid_cvc"){
                    response.error.message = "O código de segurança do cartão é inválido.";
                } else if(response.error.code == "incorrect_number"){
                    response.error.message = "O número do cartão está incorreto.";
                } else if(response.error.code == "expired_card"){
                    response.error.message = "O cartão expirou.";
                } else if(response.error.code == "incorrect_cvc"){
                    response.error.message = "O código de segurança do cartão está incorreto.";
                } else if(response.error.code == "incorrect_zip"){
                    response.error.message = "O código postal do cartão de falhou na validação.";
                } else  if(response.error.code == "card_declined"){
                    response.error.message = "O cartão foi recusado pelo nosso sistema =(";
                } else  if(response.error.code == "missing"){
                    response.error.message = "Não existe um cartão em um cliente que está sendo cobrado.";
                } else  if(response.error.code == "processing_error"){
                    response.error.message = "Ocorreu um erro ao processar o cartão.";
                }

                $('.close').click();
                $('form').prepend('<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>' + response.error.message + '</div>');
            } else {
                $('.close').click();
                $('form').prepend('<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Informações inválidas</div>');
            }

        } else {

            var planId = PaymentForm._planId(),
                cardHash = response.id;
            if (planId) {
                AccountSDK.subscribe(AccountProvider.STRIPE_BR, $('#inputEmail').val(), cardHash, planId, $('#inputPassword').val(), false, function (data) {
                    if (data.success) {
                        $('#submitButton').click();
                    } else {
                        if (data.raw.data === 1) {
                            $('.close').click();
                            $('form').prepend('<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Essa conta já é assinante Premium</div>');
                        } else {
                            $('.close').click();
                            $('form').prepend('<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Informações inválidas</div>');
                        }
                    }
                });
            } else {
                $('.close').click();
                $('form').prepend('<div class=\"alert alert-danger\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;\</a>Erro de configuração</div>');
            }
        }
    }
};

$(document).ready(
    function() {
        PaymentForm.init()
    }
);