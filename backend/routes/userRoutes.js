import express from 'express';
import { getPublishedCreations, getUserCreations } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
const userRouter = express.Router();

//user-related routes here 
userRouter.get('/get-user-creations',auth, getUserCreations);
userRouter.get('/get-published-creations',auth, getPublishedCreations);
export default userRouter;