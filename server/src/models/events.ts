import mongoose, { Schema } from 'mongoose';

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

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

export default Event;
