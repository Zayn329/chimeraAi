const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(
  '/proxy/chat',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    // We remove the pathRewrite object entirely
    on: {
        proxyReq: (proxyReq, req, res) => {
            // 🛠️ NUCLEAR OPTION: Manually overwrite the path before it leaves Node
            // This forces the request to be seen by Python as /api/chat/stream
            proxyReq.path = '/api/chat/stream';
            
            console.log(`[Proxy] Successfully intercepted and re-routed to: ${proxyReq.path}`);
        },
        proxyRes: (proxyRes, req, res) => {
            proxyRes.headers['Cache-Control'] = 'no-cache';
            proxyRes.headers['Connection'] = 'keep-alive';
        }
    }
  })
);

app.listen(PORT, () => {
  console.log(`🛡️ Chimera Gateway is running on port ${PORT}`);
});