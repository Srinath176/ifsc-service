import { Router } from "express";
import { IFSCController } from "../controllers/ifsc.controller";

/**
 * Routes for IFSC operations.
 * Exposes API endpoints that map to controller methods.
 */
const ifscRoutes = Router();
const ifscController = new IFSCController();

// GET /api/ifsc/:ifscCode
ifscRoutes.get("/:ifscCode", ifscController.getIFSCDetails);

export default ifscRoutes;
