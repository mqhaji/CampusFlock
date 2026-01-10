import mongoose, { Schema } from 'mongoose';

const OrganizerSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        profilePicUrl: { type: String },
        description: { type: String },
        verified: { type: Boolean, default: false },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', OrganizerSchema);

export default Organizer;
