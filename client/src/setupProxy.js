const { createProxyMiddleware } = require('http-proxy-middleware');
const {IP} = require('./config/Backend_IP')
const PORT = process.env.PORT || require('./config/Backend_Port')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${IP}:${PORT}`,
      changeOrigin: true
    })
  );
}