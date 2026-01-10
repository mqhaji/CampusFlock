<template>
  <v-container>
    <h1 class="mb-2">Search Results for "{{ $route.query.query }}"</h1>
    <v-row>
      <EventCard
        v-for="event in filteredEvents"
        :key="event._id"
        :event="event"
        @open="openDialog"
      />
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EventCard from '@/components/EventCard.vue';
import type { Event } from '@/types/models';
import { fetchEvents } from '@/api';

const route = useRoute();
const dialog = ref(false);
const currentEvent = ref<Event | null>(null);
const events = ref<Event[]>([]);

const filteredEvents = computed(() => {
  const searchQuery = String(route.query.query || '').toLowerCase();
  if (!searchQuery) {
    return events.value;
  }

  return events.value.filter(event =>
    event.title?.toLowerCase().includes(searchQuery) ||
    event.description?.toLowerCase().includes(searchQuery) ||
    event.details?.toLowerCase().includes(searchQuery) ||
    getOrganizerName(event.organizer, event.organizerName).toLowerCase().includes(searchQuery)
  );
});

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
    const data = await fetchEvents();
    events.value = data.map(event => ({
      ...event,
      organizerName: getOrganizerName(event.organizer, event.organizerName),
    }));
  } catch (err) {
    console.log('Error when fetching events:', err);
  }
});
</script>

<style scoped>
/* Styles specific to this search page */
</style>
