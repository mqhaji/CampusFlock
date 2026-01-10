import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    profilePicUrl: { type: String },
    bio: { type: String },
    interests: { type: [String], default: [] },
    role: { type: String, enum: ['student', 'organizer', 'admin'], default: 'student' },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

// Reuse existing model when possible (helps during hot reload).
const User = (mongoose.models.User as Model<UserDocument>) || model<UserDocument>('User', UserSchema);

export default User;
