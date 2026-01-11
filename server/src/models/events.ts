import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

// Event schema for persisted event listings.
const EventSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        details: { type: String },
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true },
        organizer: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
        location: {
            name: { type: String },
            address: { type: String },
        },
        imageUrl: { type: String },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

export type EventDocument = InferSchemaType<typeof EventSchema>;

// Reuse existing model when possible (helps during hot reload).
const Event = (mongoose.models.Event as Model<EventDocument>) || model<EventDocument>('Event', EventSchema);

export default Event;
