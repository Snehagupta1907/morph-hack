// routes/betRoutes.ts
import express from 'express';
import * as betController from '../controllers/betController';

const router = express.Router();

router.post('/', betController.placeBet);
router.get('/user/:userAddress', betController.getUserBets);
router.get('/user/:userAddress/portfolio', betController.getUserPortfolio);
router.post('/claim-winnings', betController.claimWinnings);

export default router;