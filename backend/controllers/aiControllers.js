import OpenAI from "openai";
import sql from './../configs/db.js';
import { clerkClient } from "@clerk/express";
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
export const generateArticle = async (req, res) => {
    try {
        console.log('[CONTROLLER] Generate article start');
        
        const userId = req.userId; // Use from middleware instead of calling req.auth()
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        
        console.log('[CONTROLLER] Params:', { userId, plan, free_usage, promptLength: prompt?.length });
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID' });
        }
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit Reached. Upgrade to continue"
            });
        }
        
        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: length,
        });
        
        const content = response.choices[0].message.content;
        
        await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'article')`;
        
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }
        
        res.json({ success: true, content });
        
    } catch (error) {
        console.error('[CONTROLLER] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}