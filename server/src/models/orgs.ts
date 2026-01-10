import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

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

export type OrganizerDocument = InferSchemaType<typeof OrganizerSchema>;

// Reuse existing model when possible (helps during hot reload).
const Organizer = (mongoose.models.Organizer as Model<OrganizerDocument>) || model<OrganizerDocument>('Organizer', OrganizerSchema);

export default Organizer;
