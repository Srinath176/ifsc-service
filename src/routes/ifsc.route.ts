import { Router } from 'express';
import { IFSCController } from '../controllers/ifsc.controller';

const ifscRoutes = Router();
const ifscController = new IFSCController();

// GET /api/ifsc/:ifscCode
ifscRoutes.get('/:ifscCode', ifscController.getIFSCDetails);

export default ifscRoutes;