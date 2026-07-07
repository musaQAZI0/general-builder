import mongoose, { Schema, Model, Document } from "mongoose";

export interface IQuote extends Document {
  name: string;
  phone: string;
  message: string;
  service?: string;
  createdAt: Date;
}

const QuoteSchema = new Schema<IQuote>({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quote: Model<IQuote> =
  (mongoose.models.Quote as Model<IQuote>) ||
  mongoose.model<IQuote>("Quote", QuoteSchema);

export default Quote;
