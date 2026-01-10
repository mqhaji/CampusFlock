import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

import Event from './models/events.js';
import Organizer from './models/orgs.js';
import User from './models/users.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name email profilePicUrl');
        res.json(events);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

app.get('/api/orgs', async (req, res) => {
    try {
        const orgs = await Organizer.find();
        res.json(orgs);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusflock';

connect(mongoUri)
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('error');
    });

app.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
});
