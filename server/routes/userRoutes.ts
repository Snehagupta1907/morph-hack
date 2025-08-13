import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/leaderboard', userController.getLeaderboard);
router.get('/:address', userController.getUser);
router.get('/:address/activity', userController.getUserActivity);
router.get('/:address/portfolio', userController.getUserPortfolio);

export default router;
