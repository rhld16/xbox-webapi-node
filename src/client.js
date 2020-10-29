const Authentication = require('./authentication')

module.exports = function(config){

    if(config === undefined)
        config = {}

    var clientConfig = {
        clientId: config.clientId || '',
        clientSecret: config.clientSecret || ''
    }

    return {
        _config: clientConfig,
        _authentication: Authentication(clientConfig['clientId'], clientConfig['clientSecret']),

        isAuthenticated: function(){
            return this._authentication.isAuthenticated()
        },

        startAuthServer: function(callback, port){
            this._authentication.startServer(callback)

            return this._authentication.generateAuthorizationUrl()
        }
    }
}