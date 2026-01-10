import mongoose, { Schema } from 'mongoose';

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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
