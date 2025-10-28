import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuoteResponseProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface IQuoteResponse extends Document {
  quote: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  respondedBy: mongoose.Types.ObjectId; // Employee who responded
  products: IQuoteResponseProduct[];
  subtotal: number;
  tax?: number;
  total: number;
  message?: string;
  validUntil: Date;
  status: 'sent' | 'viewed' | 'accepted' | 'rejected';
  viewedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteResponseProductSchema = new Schema<IQuoteResponseProduct>(
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
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const QuoteResponseSchema = new Schema<IQuoteResponse>(
  {
    quote: {
      type: Schema.Types.ObjectId,
      ref: 'Quote',
      required: true,
      index: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    products: {
      type: [QuoteResponseProductSchema],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    validUntil: {
      type: Date,
      required: true,
      default: function() {
        // Default validity: 15 days from response
        return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      },
    },
    status: {
      type: String,
      enum: ['sent', 'viewed', 'accepted', 'rejected'],
      default: 'sent',
      required: true,
      index: true,
    },
    viewedAt: {
      type: Date,
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding responses by employee
QuoteResponseSchema.index({ respondedBy: 1, createdAt: -1 });

const QuoteResponse: Model<IQuoteResponse> = 
  mongoose.models.QuoteResponse || mongoose.model<IQuoteResponse>('QuoteResponse', QuoteResponseSchema);

export default QuoteResponse;

