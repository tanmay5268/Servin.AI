import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle } from '../controllers/aicontroller.js';

const aiRouter=express.Router();

aiRouter.post('/generate-article',generateArticle,auth);

export default aiRouter;
