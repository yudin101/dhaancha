import { z } from "zod";
import type { ZodOpenApiPathsObject } from "zod-openapi";

const healthDocs: ZodOpenApiPathsObject = {
  "/api/v1/health/check": {
    get: {
      summary: "Health Check",
      tags: ["Health"],
      security: [],
      responses: {
        "200": {
          description: "Health Check OK",
          content: {
            "application/json": {
              schema: z.object({
                message: z.literal("Healthy"),
                status: z.literal(200),
              }),
            },
          },
        },
      },
    },
  },
};

export default healthDocs;
