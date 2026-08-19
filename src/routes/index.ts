import { Router } from "express";
import  healthRoutes from "./health.route.js";
import swaggerUi from "swagger-ui-express";
import { document } from "../swagger/index.js";

const authRouter = Router();

// Keep authentication related routes here
// authRouter.use();

const generalRouter = Router();

generalRouter.use("/health", healthRoutes);

generalRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(document));

export { generalRouter, authRouter };
