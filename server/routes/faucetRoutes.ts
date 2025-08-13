import express from 'express';
import * as faucetController from '../controllers/faucetController';
const router = express.Router();
router.get('/drip-Tokens', faucetController.dripFaucet);

export default router;