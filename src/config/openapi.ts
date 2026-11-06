import openapi from "@elysia/openapi";

export type OpenAPIOptions = NonNullable<Parameters<typeof openapi>>[0];

export const openapiConfig: OpenAPIOptions = {
  documentation: {
    info: {
      title: "Movie Watchlist API",
      description: "Movie Watchlist API",
      version: "1.0.0"
    },
    tags: [
      { name: 'Auth', description: 'For Authentication' },
      { name: 'Movies', description: 'For display movie' },
      { name: 'Watchlist', description: 'For display movie watchlist' },
      { name: 'Watched', description: 'For display movie watched' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  path: "/docs"
}