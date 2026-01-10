import type { Event, Organizer, User } from '@/types/models';

const API_BASE = 'http://localhost:3000';

async function fetchJson<T>(path: string): Promise<T> {
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
