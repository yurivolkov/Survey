var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_LOCATION : '"http://server.optimalrating.com/api/panel/"',
  WEB_API_LOCATION : '"http://server.optimalrating.com/api/"',
  CDN_LOCATION : '"http://server.optimalrating.com/"',
})
