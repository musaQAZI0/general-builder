import mongoose, { Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  phone: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  // Hashed password-reset token + its expiry (set only during a reset flow).
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Reuse the model if it already exists (prevents OverwriteModelError on hot reload).
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
