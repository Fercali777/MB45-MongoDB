"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.Comment = mongoose_1.default.model('Comment', commentSchema);
