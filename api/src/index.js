const { app } = require('@azure/functions');

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://52.176.21.187:5000';

app.http('proxy', {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  authLevel: 'anonymous',
  route: '{*rest}',
  handler: async (request, context) => {
    try {
      const rest = request.params.rest || '';
      const url = new URL(request.url);
      const targetUrl = `${BACKEND_URL}/api/${rest}${url.search}`;

      // Collect incoming headers, skipping hop-by-hop headers
      const headers = {};
      for (const [key, value] of request.headers.entries()) {
        const k = key.toLowerCase();
        if (k !== 'host' && k !== 'connection' && k !== 'content-length') {
          headers[key] = value;
        }
      }

      // Preserve origin header for CORS validation
      if (!headers['origin']) {
        headers['origin'] = 'https://www.nexatalentitsolutions.com';
      }

      // Preserve JWT token across SWA header proxy
      const clientAuth =
        request.headers.get('x-access-token') ||
        request.headers.get('x-nexa-authorization') ||
        request.headers.get('x-authorization') ||
        request.headers.get('authorization') ||
        '';

      if (clientAuth) {
        const fullToken = clientAuth.startsWith('Bearer ') ? clientAuth : `Bearer ${clientAuth}`;
        headers['authorization'] = fullToken;
        headers['x-access-token'] = fullToken;
        headers['x-nexa-authorization'] = fullToken;
      }

      const options = {
        method: request.method,
        headers,
      };

      // Forward request body for mutation methods
      if (['POST', 'PUT', 'PATCH'].includes(request.method.toUpperCase())) {
        try {
          const bodyBuffer = await request.arrayBuffer();
          if (bodyBuffer && bodyBuffer.byteLength > 0) {
            options.body = Buffer.from(bodyBuffer);
          }
        } catch (e) {
          // Empty or unreadable body, proceed without body
        }
      }

      const upstreamRes = await fetch(targetUrl, options);

      // Collect upstream response headers
      const resHeaders = {};
      for (const [k, v] of upstreamRes.headers.entries()) {
        const lk = k.toLowerCase();
        if (lk !== 'transfer-encoding' && lk !== 'connection' && lk !== 'content-encoding') {
          resHeaders[k] = v;
        }
      }

      const bodyArrayBuffer = await upstreamRes.arrayBuffer();

      return {
        status: upstreamRes.status,
        headers: resHeaders,
        body: Buffer.from(bodyArrayBuffer),
      };
    } catch (err) {
      context.error('Upstream error communicating with backend:', err);
      return {
        status: 502,
        headers: { 'content-type': 'application/json' },
        jsonBody: {
          success: false,
          message: 'Error communicating with backend service.',
          error: err.message,
        },
      };
    }
  },
});
