import { Router } from "express";
import healthRoutes from "./health.route.js";
import swaggerUi from "swagger-ui-express";
import document from "../swagger/index.js";

const authRouter = Router();

// Keep authentication related routes here
// authRouter.use();

const generalRouter = Router();

generalRouter.use("/health", healthRoutes);

generalRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(document, {
    customSiteTitle: "API",
    // customfavIcon: "", // Use your own favicon
    swaggerOptions: {
      docExpansion: "none",
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      body {
        height: 100vh;
        background: #161718;
      }
      .swagger-ui { background: #161718; color: #e5e7eb; }
      .swagger-ui .scheme-container { background: #161718; }
      html.dark-mode body,
      html.dark-mode .swagger-ui,
      html.dark-mode .swagger-ui .scheme-container {
        background: #161718 !important;
      }
      .swagger-ui .info,
      .swagger-ui .opblock-tag,
      .swagger-ui .opblock-tag small { color: #e5e7eb; }
      .swagger-ui .info hgroup.main::after {
        content: "[ Base URL: /api/v1 ]";
        display: block;
        margin-top: 0.5em;
        color: #e5e7eb;
        font-family: monospace;
      }
  `,
  }),
);

export { generalRouter, authRouter };
