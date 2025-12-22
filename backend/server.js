import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

/* console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? '✓ Loaded' : '✗ Missing');
console.log('CLERK_PUBLISHABLE_KEY:', process.env.CLERK_PUBLISHABLE_KEY ? '✓ Loaded' : '✗ Missing');
 */
const app = express();
await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); 

// Public routes (no auth required)
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Protected routes (auth required)
app.use(requireAuth()); 
app.use('/api/ai', aiRouter);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});