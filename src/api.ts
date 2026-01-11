import type { Event, Organizer, User } from '@/types/models';

// Use VITE_API_BASE when provided, otherwise default to local dev server.
const rawApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
// Normalize the base URL so we don't end up with double slashes.
const API_BASE = rawApiBase.replace(/\/+$/, '');

async function fetchJson<T>(path: string): Promise<T> {
  // Centralized fetch helper so errors and response parsing stay consistent.
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchEvents(): Promise<Event[]> {
  return fetchJson<Event[]>('/api/events');
}

export function fetchUsers(): Promise<User[]> {
  return fetchJson<User[]>('/api/users');
}

export function fetchOrganizers(): Promise<Organizer[]> {
  return fetchJson<Organizer[]>('/api/orgs');
}
