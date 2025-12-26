import express from 'express';
import { getPublishedCreations, getUserCreations, numberOfCreationsByUser } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
const userRouter = express.Router();

//user-related routes here 
userRouter.get('/get-user-creations',auth, getUserCreations);
userRouter.get('/get-published-creations',auth, getPublishedCreations);
userRouter.post('/number-of-creations-by-user', auth, numberOfCreationsByUser)
export default userRouter;