const jwt = require('jsonwebtoken');
const User = require('../models/User');

const TIER_MAPPING = {
    'Worker': 1, // Operational
    'Assistant Manager': 1, // Operational
    
    'Deputy Manager': 2, // Managerial
    'Manager': 2, // Managerial
    'Senior Manager': 2, // Managerial
    'Chief Manager': 2, // Managerial
    
    'DGM': 3, // Executive
    'JGM': 3, // Executive
    'GM': 3, // Executive
    'Unit Head': 3 // Executive
};

const getTierLevel = (grade) => {
    return TIER_MAPPING[grade] || 1; // Default to Operational if not found
};

const getTierName = (level) => {
    if (level === 1) return 'OPERATIONAL';
    if (level === 2) return 'MANAGERIAL';
    if (level === 3) return 'EXECUTIVE';
    return 'OPERATIONAL';
};

// Authentication & Tier resolving middleware
const authenticate = async (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');
    let token = req.header('x-auth-token');

    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.userPayload = decoded.user;

        // Fetch user from DB to verify grade/tier
        const user = await User.findById(decoded.user.id).select('-password');
        if (!user) {
            return res.status(401).json({ msg: 'User not found, authorization denied' });
        }

        req.user = user;
        req.tierLevel = getTierLevel(user.grade);
        req.tierName = getTierName(req.tierLevel);

        next();
    } catch (err) {
        console.error('Token validation error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Enforce minimum tier
const requireTier = (minTierName) => {
    const minLevel = minTierName === 'EXECUTIVE' ? 3 : minTierName === 'MANAGERIAL' ? 2 : 1;
    
    return (req, res, next) => {
        if (!req.tierLevel || req.tierLevel < minLevel) {
            return res.status(403).json({ 
                msg: `Access denied. Requires ${minTierName} tier privilege. Current tier: ${req.tierName}` 
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    requireTier,
    getTierLevel,
    getTierName
};
