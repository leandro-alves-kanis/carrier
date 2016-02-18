var AccountProvider = {
    STRIPE_BR: 'APP_BR',
    STRIPE_WW: 'APP_STRIPE_WW'
};

var AccountSDK = {

    _BASE_API: '/api/v1/',

    getTokenKey: function(provider) {
        if (provider === AccountProvider.STRIPE_BR) {
            return 'pk_live_Q9HN0xZwD6d8qsCy1sjhfIZ9';
        } else if (provider === AccountProvider.STRIPE_WW) {
            return 'pk_live_9tpOldZkSdoFdg3blaI6AVNa';
        }
        return null;
    },

    setupReports:  function() {
        HttpUtils.getProperty("af");
        HttpUtils.getProperty("c");
    },

    subscribe: function(provider, login, cardHash, plan, password, hasEncryption, callback) {
        if (hasEncryption) {
            AccountSDK._decryptPassword(password, function(decryptedPassword) {
                AccountSDK._performSubscribeRequest(provider, login, cardHash, plan, decryptedPassword, callback)
            });
        } else {
            AccountSDK._performSubscribeRequest(provider, login, cardHash, plan, password, callback)
        }
    },

    signup: function(provider, login, password, callback) {
        $.post(
            AccountSDK._BASE_API + '/user/signup',
            {
                email: login,
                password: password,
                applicationName: provider
            },
            function (data) {
                if (!data) {
                    callback({success: false, raw: data});
                } else {
                    if (data.success) {
                        AccountSDK._saveDevice(data);
                        AccountSDK._createPasswordCrypt(password, function(encryptedPassword) {
                            if (!encryptedPassword) {
                                callback({success: false, raw: data});
                            } else {
                                callback({success: true, encryptedPassword: encryptedPassword, raw: data});
                            }
                        });
                    } else {
                        callback({success: false, raw: data});
                    }
                }
            }
        );
    },

    hasSubscription: function(provider, login, password, callback) {
        var appInstall = HttpUtils.getCookie('appInstallId'),
            userId = HttpUtils.getCookie('userId');
        $.post(
            AccountSDK._BASE_API + '/user/check-subscription',
            {
                email: login,
                password: password,
                userId: userId,
                applicationName: provider,
                appInstallId: appInstall
            },
            function (data) {
                if (!data) {
                    callback({success: false, raw: data});
                } else {
                    AccountSDK._saveDevice(data);
                    if (data.data.status) {
                        callback({success: (data.data.statusAsEnum === "USER_SUBSCRIBED"), raw: data});
                   } else {
                        callback({success: false, raw: data});
                    }
                }
            }
        );

    },

    signin: function(provider, login, password, callback) {
        var appInstall = HttpUtils.getCookie('appInstallId'),
            userId = HttpUtils.getCookie('userId');
        $.post(
            AccountSDK._BASE_API + '/user/login',
            {
                email: login,
                password: password,
                userId: userId,
                applicationName: provider,
                appInstallId: appInstall
            },
            function (data) {
                    if (!data) {
                        callback({success: false, raw: data});
                    } else {
                        AccountSDK._saveDevice(data);
                        if (data.data.status) {
                            AccountSDK._createPasswordCrypt(password, function(encryptedPassword) {
                                if (!encryptedPassword) {
                                    callback({success: false, raw: data});
                                } else {
                                    callback({success: true, encryptedPassword: encryptedPassword, raw: data});
                                }
                            });
                        } else {
                            callback({success: false, raw: data});
                        }
                    }
            }
        );
    },

    forgot: function(provider, login, lang, callback) {
        $.get(AccountSDK._BASE_API + 'user/forgot-password?email=' + login + '&lang=' + lang + '&applicationName=' + provider, function(data) {
            callback({ success: data.data, raw: data });
        });
    },

    exists:  function(provider, login, callback) {
        $.get(AccountSDK._BASE_API + 'user/exists?email=' + login + '&applicationName=' + provider, function(data) {
            callback({ exists: (data.data.status === 'SUCCESS'), raw: data });
        });
    },

    _performSubscribeRequest: function(provider, login, cardHash, plan, password, callback) {
        $.post(
        AccountSDK._BASE_API + 'subscription/subscribe',
        {
            email: login,
            password: password,
            card_hash: cardHash,
            plan: plan,
            campaign: HttpUtils.getProperty("c") ? HttpUtils.getProperty("c") : "Unknown",
            affiliate: HttpUtils.getProperty("af") ? HttpUtils.getProperty("af") : "Unknown",
            applicationName: provider
        },
        function (data) {
            if (!data) {
                callback({success: false, raw: data});
            } else {
                if (data.success) {
                    AccountSDK._saveDevice(data);
                    AccountSDK._createPasswordCrypt(password, function(encryptedPassword) {
                        if (!encryptedPassword) {
                            callback({success: false, raw: data});
                        } else {
                            callback({success: true, encryptedPassword: encryptedPassword, raw: data});
                        }
                    });
                } else {
                    callback({success: false, raw: data});
                }
            }
        });
    },

    _decryptPassword: function(data, callback) {
        var jsonText = $.base64.decode(data),
            json = JSON.parse(jsonText);

        $.get(AccountSDK._BASE_API + 'tools/decrypt?i=' + data.iv + '&s=' + secret + '&d=' + json.data, function(data) {
            callback(data)
        });
    },

    _saveDevice: function(data) {
        if (data.data.userId) {
            HttpUtils.saveCookie('userId', data.data.userId);
        }
        if (data.data.appInstallId) {
             HttpUtils.saveCookie('appInstallId', data.data.appInstallId);
        }
    },

    _createPasswordCrypt: function(password, callback) {
        var secret = AccountSDK._generateSecret()
        $.get(AccountSDK._BASE_API + 'tools/crypt?s=' + secret + '&d=' + password, function(data) {
            var result = { data: data.data, iv: data.iv, secret: secret }
            callback($.base64.encode(JSON.stringify(result)))
        });
    },

    _generateSecret : function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}