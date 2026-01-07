import { z } from 'zod';
import { insertCommuteRouteSchema, commuteRoutes, trafficStats } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  routes: {
    list: {
      method: 'GET' as const,
      path: '/api/routes',
      responses: {
        200: z.array(z.custom<typeof commuteRoutes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/routes',
      input: insertCommuteRouteSchema,
      responses: {
        201: z.custom<typeof commuteRoutes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/routes/:id',
      responses: {
        200: z.custom<typeof commuteRoutes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/routes/:id',
      input: insertCommuteRouteSchema.partial(),
      responses: {
        200: z.custom<typeof commuteRoutes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  predictions: {
    get: {
      method: 'GET' as const,
      path: '/api/routes/:id/prediction',
      responses: {
        200: z.object({
          currentStatus: z.custom<typeof trafficStats.$inferSelect>(),
          forecast: z.array(z.object({
            time: z.string(),
            congestion: z.number(),
          })),
          bestDepartureTime: z.string(),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  device: {
    sync: {
      method: 'POST' as const,
      path: '/api/device/sync',
      input: z.object({
        status: z.enum(['green', 'yellow', 'red']),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
