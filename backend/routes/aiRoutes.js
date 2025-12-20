import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle } from '../controllers/aiControllers.js';
const aiRouter = express.Router();

aiRouter.post('/generate-article',generateArticle)
export default aiRouter;