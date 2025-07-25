"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const Product_1 = require("../models/Product");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Helper function to get user from token
const getUserFromToken = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token missing');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await User_1.User.findById(decoded.id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
// Add product to favorites
router.post('/add/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await getUserFromToken(req);
        // Check if product exists
        const product = await Product_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if already in favorites
        if (user.favorites.includes(productId)) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }
        // Add to favorites
        user.favorites.push(productId);
        await user.save();
        res.status(200).json({ message: 'Product added to favorites', favorites: user.favorites });
    }
    catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Remove product from favorites
router.delete('/remove/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await getUserFromToken(req);
        // Remove from favorites
        user.favorites = user.favorites.filter((fav) => fav.toString() !== productId);
        await user.save();
        res.status(200).json({ message: 'Product removed from favorites', favorites: user.favorites });
    }
    catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user favorites
router.get('/my-favorites', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        // Populate favorites with product details
        const populatedUser = await User_1.User.findById(user._id).populate('favorites');
        if (!populatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ favorites: populatedUser.favorites });
    }
    catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Check if product is in favorites
router.get('/check/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await getUserFromToken(req);
        const isFavorite = user.favorites.includes(productId);
        res.status(200).json({ isFavorite });
    }
    catch (error) {
        console.error('Error checking favorite status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
