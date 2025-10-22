import express from 'express';
import { getRecommendedIngredients } from '../controllers/ReminderTimeController.js';

const router = express.Router();

// Route: /api/recommendations/:userId
router.get('/:userId', getRecommendedIngredients);

export default router;
