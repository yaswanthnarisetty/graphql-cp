import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the user document
interface UserDocument extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  salt: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the User model
const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export default User;
