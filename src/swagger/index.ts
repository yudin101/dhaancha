import { createDocument, ZodOpenApiObject } from "zod-openapi";
import { healthDocs } from "./health.swagger.js";

export const document = createDocument({
  openapi: "3.1.0",
  info: { title: "API", version: "1.0.0" },
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...healthDocs,
  },
}) as ZodOpenApiObject;
