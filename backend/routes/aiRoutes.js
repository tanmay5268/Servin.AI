import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle, generateBlogTitle, generateImage } from '../controllers/aiControllers.js';
const aiRouter = express.Router();

aiRouter.post('/generate-article',generateArticle)
aiRouter.post('/generate-blog-title',generateBlogTitle)
aiRouter.post('/generate-image', generateImage)
export default aiRouter;