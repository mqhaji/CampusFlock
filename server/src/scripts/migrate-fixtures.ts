import { connect, disconnect } from 'mongoose';
import type { Types } from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import Event from '../models/events.js';
import Organizer from '../models/orgs.js';
import User from '../models/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '..', 'data');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusflock';
const shouldDrop = process.argv.includes('--drop');

// Shapes of the JSON fixture files we import.
type EventFixture = {
  userId: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  extendedDescription?: string;
  image?: string | null;
};

type OrganizerFixture = {
  userID?: string;
  name: string;
  email: string;
  profilePic?: string | null;
  description?: string;
};

type UserFixture = {
  name: string;
  email: string;
  profilePic?: string | null;
  description?: string;
  interests?: string;
};

async function readJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(dataDir, fileName);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function splitInterests(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[;\n]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function migrate() {
  await connect(mongoUri);

  if (shouldDrop) {
    await Event.deleteMany({});
    await Organizer.deleteMany({});
    await User.deleteMany({});
  }

  const [eventsData, orgsData, usersData] = await Promise.all([
    readJson<EventFixture[]>('events.json'),
    readJson<OrganizerFixture[]>('orgs.json'),
    readJson<UserFixture[]>('users.json'),
  ]);

  const organizerIdByLegacyUserId = new Map<string, Types.ObjectId>();

  for (const org of orgsData) {
    const organizerData = {
      name: org.name,
      email: org.email,
      profilePicUrl: org.profilePic || undefined,
      description: org.description || undefined,
    };

    const organizer = await Organizer.findOneAndUpdate(
      { email: organizerData.email },
      { $set: organizerData },
      { new: true, upsert: true }
    );

    if (org.userID) {
      organizerIdByLegacyUserId.set(org.userID, organizer._id);
    }
  }

  for (const user of usersData) {
    const userData = {
      name: user.name,
      email: user.email,
      profilePicUrl: user.profilePic || undefined,
      bio: user.description || undefined,
      interests: splitInterests(user.interests),
    };

    await User.findOneAndUpdate(
      { email: userData.email },
      { $set: userData },
      { new: true, upsert: true }
    );
  }

  for (const event of eventsData) {
    const organizerId = organizerIdByLegacyUserId.get(event.userId);

    if (!organizerId) {
      console.warn(`Skipping event "${event.name}" (missing organizer for ${event.userId}).`);
      continue;
    }

    const eventData = {
      title: event.name,
      description: event.description,
      details: event.extendedDescription,
      startAt: new Date(event.startTime),
      endAt: new Date(event.endTime),
      organizer: organizerId,
      imageUrl: event.image || undefined,
      tags: [] as string[],
    };

    await Event.findOneAndUpdate(
      { title: eventData.title, organizer: organizerId },
      { $set: eventData },
      { new: true, upsert: true }
    );
  }

  await disconnect();
}

migrate()
  .then(() => {
    console.log('Migration complete.');
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  });
