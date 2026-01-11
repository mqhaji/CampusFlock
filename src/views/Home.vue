<template>
  <v-container>
    <h1 class="mb-2">Upcoming Events</h1>
    <v-row>
      <EventCard v-for="event in sortedEvents" :key="event._id" :event="event" @open="openDialog" />
    </v-row>

    <!-- Dialog for Event Details -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="text-h5">{{ currentEvent?.title }}</v-card-title>
        <v-card-subtitle>
          Date: {{ formatDate(currentEvent?.startAt, { dateOnly: true }) }}
          <br>
          Start: {{ formatDate(currentEvent?.startAt) }} - End: {{ formatDate(currentEvent?.endAt) }}
          <br>
          Organized by: {{ currentEvent?.organizerName }}
        </v-card-subtitle>
        <v-card-text>{{ currentEvent?.details || currentEvent?.description }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" variant="text" @click="closeDialog">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EventCard from '@/components/EventCard.vue';
import type { Event, Organizer } from '@/types/models';
import { fetchEvents } from '@/api';

const sortedEvents = ref<Event[]>([]);
const dialog = ref(false);
const currentEvent = ref<Event | null>(null);

// Format event date/time for cards and dialogs.
function formatDate(isoString: string | Date | undefined, options: { dateOnly?: boolean } = {}) {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  if (options.dateOnly) {
    return date.toLocaleDateString();
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getOrganizerName(organizer?: Event['organizer'], fallback?: string) {
  if (organizer && typeof organizer !== 'string') {
    return organizer.name;
  }
  return fallback || 'Unknown Organizer';
}

// Normalize date inputs before sorting.
function toDate(value: string | Date | undefined) {
  return value instanceof Date ? value : new Date(value ?? '');
}

// Open the event details dialog with extra display fields.
function openDialog(event: Event) {
  currentEvent.value = {
    ...event,
    organizerName: getOrganizerName(event.organizer, event.organizerName),
  };
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

onMounted(async () => {
  try {
    // Load events once on page mount.
    const data = await fetchEvents();
    sortedEvents.value = data
      .map(event => ({
        ...event,
        organizerName: getOrganizerName(event.organizer, event.organizerName),
      }))
      .sort((a, b) => toDate(a.startAt).getTime() - toDate(b.startAt).getTime());
  } catch (err) {
    console.log('Error when fetching events:', err);
  }
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
