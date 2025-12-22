import OpenAI from "openai";
import sql from './../configs/db.js';
/* import { clerkClient } from "@clerk/express"; */
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
const AI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,

});
{/* ------------------------------------------------------------------------------------------------------------ */ }
export const generateArticle = async (req, res) => {
    try {
        console.log('[CONTROLLER] Generate article start');
        const userId = req.auth().userId; // Use from middleware instead of calling req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID' });
        }
        const { prompt, length } = req.body;
        /* const plan = req.plan;
        const free_usage = req.free_usage;
        console.log('[CONTROLLER] Params:', { userId, plan, free_usage, promptLength: prompt?.length });
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit Reached. Upgrade to continue"
            });
        } */
        const response = await AI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a detailed article based on the following prompt: ${prompt}, and the length should be around ${length} words.`,
        });
        const content = response.text;
        try { await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'article')`; } catch (e) {
            console.log('[CONTROLLER] DB Insert Error:', e.message);
        }

        /* if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        } */
        res.json({ success: true, content });
    } catch (error) {
        console.error('[CONTROLLER] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
{/* ------------------------------------------------------------------------------------------------------------ */ }


export const generateBlogTitle = async (req, res) => {
    try {
        console.log('[CONTROLLER] Generate blogTitle start');
        const userId = req.auth.userId; // Use from middleware instead of calling req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID' });
        }
        const { prompt} = req.body;
        /* const plan = req.plan;
        const free_usage = req.free_usage;
        console.log('[CONTROLLER] Params:', { userId, plan, free_usage, promptLength: prompt?.length });
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit Reached. Upgrade to continue"
            });
        } */
        const response = await AI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 5 catchy blog title based on the following prompt: ${prompt}. Give the output as a comma separated list.`,
            rules: [
                "Do not include numbering in the titles.",
                "Make sure the titles are engaging and relevant to the prompt."
            ]
        });
        const content = response.text;
        try { await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'blog-title')`; } catch (e) {
            console.log('[CONTROLLER] DB Insert Error:', e.message);
        }

        /* if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        } */
        res.json({ success: true, content });
    } catch (error) {
        console.error('[CONTROLLER] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
{/* ------------------------------------------------------------------------------------------------------------ */ }


export const generateImage = async (req, res) => {
    try {
        console.log('[CONTROLLER] Generate image start');
        const userId = req.auth().userId; // Use from middleware instead of calling req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID' });
        }
        const { prompt,published} = req.body;
        /* const plan = req.plan;
        const free_usage = req.free_usage;
        console.log('[CONTROLLER] Params:', { userId, plan, free_usage, promptLength: prompt?.length });
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit Reached. Upgrade to continue"
            });
        } */
        const form = new FormData()
        form.append('prompt', prompt);
        const {data}=await axios.post("https://clipdrop-api.co/text-to-image/v1", form, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: 'arraybuffer'
        })
        const content = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
        const {secure_url}=await cloudinary.uploader.upload(content)


        try { await sql`INSERT INTO creations (user_id,prompt,content,type,published) VALUES (${userId},${prompt},${secure_url},'image',${published ?? false})`; } catch (e) {
            console.log('[CONTROLLER] DB Insert Error:', e.message);
        }

        /* if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        } */
        res.json({ success: true, content:secure_url });
    } catch (error) {
        console.error('[CONTROLLER] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
{/* ------------------------------------------------------------------------------------------------------------ */ }

