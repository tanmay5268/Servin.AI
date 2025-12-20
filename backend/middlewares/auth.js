//middleware to check user id and if he has premium plan..

import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        console.log('[AUTH] Starting auth middleware');
        
        // Get auth from request
        const auth = req.auth;
        /* console.log('[AUTH] Auth object:', { userId: auth?.userId, has: typeof auth?.has }); */
        
        if (!auth || !auth.userId) {
            console.log('[AUTH] No userId found');
            return res.status(401).json({ error: 'Unauthorized - no userId' });
        }
        req.userId = auth.userId;
        
        /* const userId = req.auth.userId;
        const hasPremiumPlan = await req.auth.has({ plan: 'premium' });
        const plan = hasPremiumPlan ? 'premium' : 'free';
        
        console.log('[AUTH] UserId:', userId);
        console.log('[AUTH] Premium plan check:', plan);
        
        // Get user from Clerk
        let user;
        try {
            user = await clerkClient.users.getUser(userId);
            console.log('[AUTH] User fetched:', { userId, plan: user.privateMetadata?.plan });
        } catch (e) {
            console.log('[AUTH] Failed to fetch user:', e.message);
            return res.status(401).json({ error: 'Failed to fetch user info' });
        }
        
        // Set free usage
        if (!hasPremiumPlan && user.privateMetadata?.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            try {
                await clerkClient.users.updateUserMetadata(userId, {
                    privateMetadata: { free_usage: 0 }
                });
            } catch (e) {
                console.log('[AUTH] Failed to update metadata:', e.message);
            }
            req.free_usage = 0;
        }
        
        req.plan = hasPremiumPlan ? 'premium' : 'free';
            req.userId = userId;
        
        console.log('[AUTH] Auth complete:', { plan: req.plan, free_usage: req.free_usage }); */ 
        next();
    } catch (error) {
        console.error('[AUTH] Middleware error:', error);
        return res.status(401).json({ 
            error: 'Authentication failed', 
            details: error.message,
        });
    }
}