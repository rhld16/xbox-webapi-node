const assert = require('assert');
const Authentication = require('../src/authentication')

var http = require('http')
var mockserver = require('mockserver')('tests/mock_data', false)

mockserver.verbose = true


describe('authentication', function(){
    before(function(){
        this.serverRun = http.createServer(mockserver).listen(9001);
    })

    beforeEach(function(){
        this.auth = Authentication('5e5ead27-ed60-482d-b3fc-702b28a97404')
        this.auth._endpoints = {
            live: 'http://localhost:9001',
            auth: 'http://127.0.0.1:9001'
        }
    })

    it('should generate an authorization url', function(){
        // var auth = Authentication('5e5ead27-ed60-482d-b3fc-702b28a97404')
        var url = this.auth.generateAuthorizationUrl('http://localhost:8080/auth/callback')

        assert.deepStrictEqual(this.auth._clientId, '5e5ead27-ed60-482d-b3fc-702b28a97404')
        assert.deepStrictEqual(url, 'https://login.live.com/oauth20_authorize.srf?client_id=5e5ead27-ed60-482d-b3fc-702b28a97404&response_type=code&approval_prompt=auto&scope=XboxLive.signin%20XboxLive.offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fcallback')
    })

    it('should get a oauth token when invoking getTokenRequest()', function(done){
        this.auth.getTokenRequest('abc123', function(tokens, error){
            assert.deepStrictEqual(tokens.token_type, 'bearer')
            assert.deepStrictEqual(tokens.expires_in, 3600)
            assert.deepStrictEqual(tokens.scope, 'XboxLive.signin XboxLive.offline_access')
            assert.deepStrictEqual(tokens.access_token, 'access_token_example')
            assert.deepStrictEqual(tokens.refresh_token, 'refresh_token_example')
            assert.deepStrictEqual(tokens.user_id, 'user_id_example')
            
            done()
        })
    })

    it('should get a new oauth token when invoking refreshTokens()', function(done){
        this.auth.refreshToken('abc123', function(tokens, error){
            assert.deepStrictEqual(tokens.token_type, 'bearer')
            assert.deepStrictEqual(tokens.expires_in, 3600)
            assert.deepStrictEqual(tokens.scope, 'XboxLive.signin XboxLive.offline_access')
            assert.deepStrictEqual(tokens.access_token, 'access_token_example')
            assert.deepStrictEqual(tokens.refresh_token, 'refresh_token_example')
            assert.deepStrictEqual(tokens.user_id, 'user_id_example')

            done()
        })
    })

    it('should get a new user token when invoking getUserToken()', function(done){
        this.auth.getUserToken('abc123', function(tokens, error){
            assert.deepStrictEqual(tokens.IssueInstant, '2020-10-29T08:18:44.2057145Z')
            assert.deepStrictEqual(tokens.NotAfter, '2020-11-12T08:18:44.2057145Z')
            assert.deepStrictEqual(tokens.Token, 'user_token_data')
            assert.deepStrictEqual(tokens.DisplayClaims.xui[0].uhs, 'userhash_data')

            done()
        })
    })

    afterEach(function() {
        delete this.auth
    });

    after(function() {
        this.serverRun.close()
    });
})