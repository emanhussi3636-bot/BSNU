import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'staff/dean/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'staff/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'vice_president/:id',
    renderMode: RenderMode.Client
  },
  {
  path: 'gallery-conferences/:id',
  renderMode: RenderMode.Server
  },
  {
    path: 'news/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'all-events',
    renderMode: RenderMode.Server
  },
  {
    path: 'eventdetails/:eventId/:programId',
    renderMode: RenderMode.Server
  },
  {
    path: 'Program/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'clinical-program',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
