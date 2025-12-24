import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
    try {
        const userId = req.auth.userId;

        // Fetch user creations from the database
        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

        res.status(200).json({ creations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPublishedCreations = async (req, res) => {
    try {
        // Fetch user creations from the database
        const creations = await sql`SELECT * FROM creations WHERE published = true ORDER BY created_at DESC`;

        res.status(200).json({ creations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}