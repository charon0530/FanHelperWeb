const { createProxyMiddleware } = require('http-proxy-middleware');
const {IP} = require('./config/Backend_IP')
const PORT = process.env.PORT || 5000

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${IP}:${PORT}`,
      changeOrigin: true
    })
  );
}