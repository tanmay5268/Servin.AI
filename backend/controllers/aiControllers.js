import OpenAI from "openai";
import sql from './../configs/db.js';
/* import { clerkClient } from "@clerk/express"; */
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
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

export const removeImageBackground = async (req, res) => {
    try {
        console.log('[CONTROLLER] Generate image start');
        const userId = req.auth().userId; // Use from middleware instead of calling req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID' });
        }
        const {image} = req.file;
        /* const plan = req.plan;
        const free_usage = req.free_usage;
        console.log('[CONTROLLER] Params:', { userId, plan, free_usage, promptLength: prompt?.length });
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit Reached. Upgrade to continue"
            });
        } */
        
        const {secure_url}=await cloudinary.uploader.upload(image.path, {
            transformation: [{
                effect: "background_removal",
                backgrounf_removal: "remove_the_background"
            }]
        })


        try { await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},'Remove backgrounf from image',${secure_url},'image')`; } catch (e) {
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

export const removeImageObject = async (req, res) => {
    try {
        console.log('[CONTROLLER] Generate image start');
        const userId = req.auth().userId; // Use from middleware instead of calling req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID' });
        }
        const {object}=req.body;
        const {image} = req.file;
        /* const plan = req.plan;
        const free_usage = req.free_usage;
        console.log('[CONTROLLER] Params:', { userId, plan, free_usage, promptLength: prompt?.length });
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit Reached. Upgrade to continue"
            });
        } */
        
        const {public_id}=await cloudinary.uploader.upload(image.path)
        const imageUrl=cloudinary.url(public_id, {
            transformation:[{effect:`gen_remove:${object}`}],
            resource_type: "image",
        })

        try { await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${`Removed ${object} from image`},${imageUrl},'image')`; } catch (e) {
            console.log('[CONTROLLER] DB Insert Error:', e.message);
        }

        /* if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        } */
        res.json({ success: true, content:imageUrl });
    } catch (error) {
        console.error('[CONTROLLER] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



export const resumeReview = async (req, res) => {
    try {
        console.log('[CONTROLLER] Generate image start');
        const userId = req.auth().userId; // Use from middleware instead of calling req.auth()
        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID' });
        }
        const resume = req.file;
        /* const plan = req.plan;
        const free_usage = req.free_usage;
        console.log('[CONTROLLER] Params:', { userId, plan, free_usage, promptLength: prompt?.length });
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: "Limit Reached. Upgrade to continue"
            });
        } */
        
        if(resume.size>5*1024*1024){
            return  res.status(400).json({
                success: false,
                message: "File size should be less than 5MB"
            });
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdf_data = await pdf(dataBuffer);
        const prompt=`Review my resume and suggest improvements to make it more effective for job applications. Here is the content of my resume: \n\n${pdf_data.text}`;
        
        const response = await AI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            rules: [
                "Do not include numbering in the titles.",
                "Make sure the titles are engaging and relevant to the prompt."
            ]
        });
        const content = response.text;

        try { await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},'Review the uploaded resume',${content},'resume-review')`; } catch (e) {
            console.log('[CONTROLLER] DB Insert Error:', e.message);
        }

        /* if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        } */
        res.json({ success: true, content:content });
    } catch (error) {
        console.error('[CONTROLLER] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}