"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
}, {
    timestamps: true,
});
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
}, {
    timestamps: true,
});
const ProductModel = mongoose_1.default.model("Product", productSchema);
exports.default = ProductModel;
