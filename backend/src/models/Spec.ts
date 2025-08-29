import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Spec document
export interface ISpec extends Document {
  slug: string;
  clientName: string;
  brief: string;
  services: Array<{
    category: string;
    items: string[];
  }>;
  pricing: Array<{
    title: string;
    price: number;
    currency: string;
    features: string[];
  }>;
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
  meta: {
    brandColors?: string[];
    logoUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define the Spec schema
const SpecSchema = new Schema<ISpec>(
  {
    slug: { 
      type: String, 
      unique: true, 
      required: true 
    },
    clientName: { 
      type: String, 
      required: true 
    },
    brief: { 
      type: String, 
      required: true 
    },
    services: [
      {
        category: String,
        items: [String]
      }
    ],
    pricing: [
      {
        title: String,
        price: Number,
        currency: String,
        features: [String]
      }
    ],
    contact: {
      email: String,
      phone: String,
      website: String
    },
    meta: {
      brandColors: [String],
      logoUrl: String
    }
  },
  { timestamps: true }
);

// Create index on slug field
SpecSchema.index({ slug: 1 });

// Create the Spec model
const Spec = mongoose.model<ISpec>('Spec', SpecSchema);

export default Spec;