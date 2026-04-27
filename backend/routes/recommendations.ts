import { Router } from 'express';
import { getRecommendation } from '../controllers/recommendations';

const router = Router();

router.post('/recommend', getRecommendation as any);

export default router;
