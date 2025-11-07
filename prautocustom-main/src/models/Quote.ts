import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuoteProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
  notes?: string;
}

export interface IQuote extends Document {
  client: mongoose.Types.ObjectId;
  products: IQuoteProduct[];
  status: 'pending' | 'responded' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  assignedTo?: mongoose.Types.ObjectId; // Employee who handled the quote
  respondedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteProductSchema = new Schema<IQuoteProduct>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const QuoteSchema = new Schema<IQuote>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    products: {
      type: [QuoteProductSchema],
      required: true,
      validate: {
        validator: function(v: IQuoteProduct[]) {
          return v && v.length > 0;
        },
        message: 'At least one product is required',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'responded', 'accepted', 'rejected', 'expired'],
      default: 'pending',
      required: true,
      index: true,
    },
    message: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    respondedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: function() {
        // Default expiration: 30 days from creation
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding active quotes
QuoteSchema.index({ status: 1, createdAt: -1 });
QuoteSchema.index({ client: 1, status: 1 });

const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

export default Quote;

