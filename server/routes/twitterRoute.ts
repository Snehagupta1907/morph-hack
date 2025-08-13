import { Router } from 'express';
import { getPredictionQuestion } from '../controllers/twitterController';

const router = Router();

router.post('/prediction-question', getPredictionQuestion);

export default router;
