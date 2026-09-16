const { handle } = require('../aurelia-final/backend/api');

module.exports = async (req, res) => {
  const host = req.headers.host || 'localhost';
  const url = new URL(req.url, `http://${host}`);
  const pathname = decodeURI(url.pathname);
  
  if (pathname.startsWith('/api/')) {
    try {
      const handled = await handle(req, res, pathname);
      if (!handled && !res.writableEnded) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API route not found' }));
      }
    } catch (e) {
      console.error(e);
      if (!res.writableEnded) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
};
