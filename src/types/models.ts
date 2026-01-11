// Shared model types used across the frontend.
export type Id = string;

export interface Metadata {
  [key: string]: unknown;
}

export interface Location {
  name?: string;
  address?: string;
}

export interface Organizer {
  _id?: Id;
  name: string;
  email?: string;
  profilePicUrl?: string;
  description?: string;
  verified?: boolean;
  members?: Id[];
  metadata?: Metadata;
}

export interface User {
  _id?: Id;
  name: string;
  email?: string;
  profilePicUrl?: string;
  bio?: string;
  interests?: string[];
  role?: 'student' | 'organizer' | 'admin';
  metadata?: Metadata;
}

export interface Event {
  _id?: Id;
  title: string;
  description: string;
  details?: string;
  startAt: string | Date;
  endAt: string | Date;
  organizer?: Organizer | Id;
  organizerName?: string;
  location?: Location;
  imageUrl?: string;
  tags?: string[];
  metadata?: Metadata;
}
