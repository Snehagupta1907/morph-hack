// routes/marketRoutes.ts
import express from 'express';
import * as marketController from '../controllers/marketController';

const router = express.Router();

router.post('/', marketController.createMarket);
router.get('/', marketController.getAllMarkets);
router.get('/:id', marketController.getMarketById);
router.post('/:id/resolve', marketController.resolveMarket);
router.get('/user/:userAddress', marketController.getUserMarkets);

export default router;