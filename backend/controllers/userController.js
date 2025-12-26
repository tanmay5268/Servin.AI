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
        const creations = await sql`SELECT * FROM creations WHERE published = TRUE ORDER BY created_at DESC`;
        console.log('Fetched creations:', creations); // Debug log
        res.status(200).json({ creations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const numberOfCreationsByUser = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const result = await sql`SELECT COUNT(*) FROM creations WHERE user_id = ${userId}`;
        res.status(200).json({ count: parseInt(result[0].count, 10) });
    } catch (error) {
        console.error('Error fetching number of creations:', error);
        res.status(500).json({ message: error.message });
    }
}