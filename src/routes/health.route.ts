import { Router } from "express";
import { handleHealthCheck } from "../controllers/health.contoller.js";

const router = Router();

router.get("/check", handleHealthCheck);

export default router;
