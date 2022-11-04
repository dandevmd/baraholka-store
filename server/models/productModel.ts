import mongoose from "mongoose";

interface Product {
  // _id: string;
  name: string;
  slug: string;
  seller: mongoose.Schema.Types.ObjectId;
  category: string;
  image: string;
  images: string[];
  price: number;
  countInStock: number;
  brand: string;
  rating?: number;
  numReviews: number;
  description: string;
  reviews?: Review[];
}

interface Review {
  name: string;
  rating: number;
  comment?: string;
}

const reviewSchema = new mongoose.Schema<Review>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema<Product>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: [{type: String }],
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<Product>("Product", productSchema);
export default ProductModel;
