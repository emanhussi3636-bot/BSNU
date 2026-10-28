import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { type Response } from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const apiOrigin = 'http://bsnu.runasp.net';
const allowedApiOrigins = new Set([
  'http://bsnu.runasp.net',
  'http://bsnudash.runasp.net',
  'https://bsnu.runasp.net',
  'https://bsnudash.runasp.net'
]);

async function sendProxyResponse(url: URL, response: Response): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const upstream = await fetch(url);
      const body = Buffer.from(await upstream.arrayBuffer());
      response.status(upstream.status);
      response.setHeader(
        'Content-Type',
        upstream.headers.get('content-type') ?? 'application/octet-stream',
      );
      response.send(body);
      return;
    } catch (error) {
      if (response.destroyed) {
        return;
      }

      lastError = error;
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  console.error(`API proxy request failed for ${url.pathname}`, lastError);
  response.status(502).json({ error: 'API service is unavailable.' });
}

app.get('/api/ApplicationRules', (req, res) => {
  const lang = req.query['lang'];
  if (lang !== undefined && lang !== 'en' && lang !== 'ar') {
    res.status(400).json({ error: 'Unsupported application rules language.' });
    return;
  }

  const upstreamUrl = new URL('/api/ApplicationRules', apiOrigin);
  if (typeof lang === 'string') {
    upstreamUrl.searchParams.set('lang', lang);
  }
  void sendProxyResponse(upstreamUrl, res);
});

app.get('/api/ProfileUniversty', (req, res) => {
  const lang = req.query['lang'];
  if (lang !== undefined && lang !== 'en' && lang !== 'ar') {
    res.status(400).json({ error: 'Unsupported university profile language.' });
    return;
  }

  const upstreamUrl = new URL('/api/ProfileUniversty', apiOrigin);
  if (typeof lang === 'string') {
    upstreamUrl.searchParams.set('lang', lang);
  }
  void sendProxyResponse(upstreamUrl, res);
});

app.get('/api/Banner', (req, res) => {
  const lang = req.query['lang'];
  if (lang !== undefined && lang !== 'en' && lang !== 'ar') {
    res.status(400).json({ error: 'Unsupported banner language.' });
    return;
  }

  const upstreamUrl = new URL('/api/Banner', apiOrigin);
  if (typeof lang === 'string') {
    upstreamUrl.searchParams.set('lang', lang);
  }
  void sendProxyResponse(upstreamUrl, res);
});

app.get('/api/Program/:programId', (req, res, next) => {
  const { programId } = req.params;
  if (programId === 'with-programs' || programId === 'byrole') {
    next();
    return;
  }
  if (!/^\d+$/.test(programId)) {
    res.status(400).json({ error: 'Invalid program ID.' });
    return;
  }

  void sendProxyResponse(new URL(`/api/Program/${programId}`, apiOrigin), res);
});

app.get('/api/Program/:programId/manager', (req, res) => {
  const { programId } = req.params;
  const lang = req.query['lang'];
  if (!/^\d+$/.test(programId)) {
    res.status(400).json({ error: 'Invalid program ID.' });
    return;
  }
  if (lang !== undefined && lang !== 'en' && lang !== 'ar') {
    res.status(400).json({ error: 'Unsupported program manager language.' });
    return;
  }

  const upstreamUrl = new URL(`/api/Program/${programId}/manager`, apiOrigin);
  if (typeof lang === 'string') {
    upstreamUrl.searchParams.set('lang', lang);
  }
  void sendProxyResponse(upstreamUrl, res);
});

app.get('/api/Sector/:sectorId/dean', (req, res) => {
  const { sectorId } = req.params;
  const lang = req.query['lang'];
  if (!/^\d+$/.test(sectorId)) {
    res.status(400).json({ error: 'Invalid sector ID.' });
    return;
  }
  if (lang !== undefined && lang !== 'en' && lang !== 'ar') {
    res.status(400).json({ error: 'Unsupported sector dean language.' });
    return;
  }

  const upstreamUrl = new URL(`/api/Sector/${sectorId}/dean`, apiOrigin);
  if (typeof lang === 'string') {
    upstreamUrl.searchParams.set('lang', lang);
  }
  void sendProxyResponse(upstreamUrl, res);
});

app.get('/api/Users/byrole', (req, res) => {
  const roleName = req.query['roleName'];
  const allowedRoles = ['President', 'VicePresidentAcademic', 'AffairsLead'];
  if (typeof roleName !== 'string' || !allowedRoles.includes(roleName)) {
    res.status(400).json({ error: 'Invalid university role name.' });
    return;
  }

  const upstreamUrl = new URL('/api/Users/byrole', apiOrigin);
  upstreamUrl.searchParams.set('roleName', roleName);
  void sendProxyResponse(upstreamUrl, res);
});

app.get('/api/News/GetAllGroupedByCategory', (_req, res) => {
  void sendProxyResponse(new URL('/api/News/GetAllGroupedByCategory', apiOrigin), res);
});

app.get('/api/News/GetById/:id', (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    res.status(400).json({ error: 'Invalid news ID.' });
    return;
  }

  void sendProxyResponse(new URL(`/api/News/GetById/${id}`, apiOrigin), res);
});

app.get('/api/Faculty', (_req, res) => {
  void sendProxyResponse(new URL('/api/Faculty', apiOrigin), res);
});

app.get('/api/Faculty/with-programs', (_req, res) => {
  void sendProxyResponse(new URL('/api/Faculty/with-programs', apiOrigin), res);
});

app.get('/api/banner-assets/:assetPath(*)', (req, res) => {
  const requestedPath = req.params['assetPath'];
  const upstreamUrl = new URL(requestedPath, apiOrigin);
  if (
    !allowedApiOrigins.has(upstreamUrl.origin) ||
    !upstreamUrl.pathname.startsWith('/assets/hero/')
  ) {
    res.status(400).json({ error: 'Invalid banner image path.' });
    return;
  }

  void sendProxyResponse(upstreamUrl, res);
});

app.get('/api/profile-assets/:assetPath(*)', (req, res) => {
  const requestedPath = req.params['assetPath'];
  const upstreamUrl = new URL(requestedPath, apiOrigin);
  if (
    !allowedApiOrigins.has(upstreamUrl.origin) ||
    !upstreamUrl.pathname.startsWith('/assets/profile/')
  ) {
    res.status(400).json({ error: 'Invalid university profile image path.' });
    return;
  }

  void sendProxyResponse(upstreamUrl, res);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
