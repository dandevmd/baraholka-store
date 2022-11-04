import mongoose from "mongoose";

interface User {
  // _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isSeller: boolean;
  seller: {
    name: string;
    logo:string;
    description: string;
    rating: number;
    numReviews: number;
  };
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isSeller: { type: Boolean, required: true, default: false },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
