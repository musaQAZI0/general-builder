import mongoose, { Schema, Model, Document } from "mongoose";

export interface IQuote extends Document {
  userEmail?: string;
  name: string;
  phone: string;
  message: string;
  service?: string;
  postcode?: string;
  propertyType?: string;
  timeline?: string;
  budget?: string;
  preferredContact?: string;
  status: "Received" | "Reviewing" | "Estimate Sent" | "Approved" | "In Progress" | "Completed";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>({
  userEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
  },
  service: {
    type: String,
    trim: true,
  },
  postcode: { type: String, trim: true },
  propertyType: { type: String, trim: true },
  timeline: { type: String, trim: true },
  budget: { type: String, trim: true },
  preferredContact: { type: String, trim: true },
  status: {
    type: String,
    enum: ["Received", "Reviewing", "Estimate Sent", "Approved", "In Progress", "Completed"],
    default: "Received",
  },
  adminNotes: { type: String, trim: true },
}, { timestamps: true });

const Quote: Model<IQuote> =
  (mongoose.models.Quote as Model<IQuote>) ||
  mongoose.model<IQuote>("Quote", QuoteSchema);

export default Quote;
