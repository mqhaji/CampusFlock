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
        <v-card-title class="text-h5">{{ currentEvent.title }}</v-card-title>
        <v-card-subtitle>
          Date: {{ formatDate(currentEvent.startAt, { dateOnly: true }) }}
          <br>
          Start: {{ formatDate(currentEvent.startAt) }} - End: {{ formatDate(currentEvent.endAt) }}
          <br>
          Organized by: {{ currentEvent.organizerName }}
        </v-card-subtitle>
        <v-card-text>{{ currentEvent.details || currentEvent.description }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeDialog">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EventCard from '@/components/EventCard.vue';

const route = useRoute();
const dialog = ref(false);
const currentEvent = ref({});
const events = ref([]);

const filteredEvents = computed(() => {
  const searchQuery = String(route.query.query || '').toLowerCase();
  if (!searchQuery) {
    return events.value;
  }

  return events.value.filter(event =>
    event.title?.toLowerCase().includes(searchQuery) ||
    event.description?.toLowerCase().includes(searchQuery) ||
    event.details?.toLowerCase().includes(searchQuery) ||
    event.organizer?.name?.toLowerCase().includes(searchQuery)
  );
});

function formatDate(isoString, options = {}) {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  if (options.dateOnly) {
    return date.toLocaleDateString();
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function openDialog(event) {
  currentEvent.value = {
    ...event,
    organizerName: event.organizer?.name || event.organizerName || 'Unknown Organizer',
  };
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/events');
    const data = await response.json();
    events.value = data.map(event => ({
      ...event,
      organizerName: event.organizer?.name || 'Unknown Organizer',
    }));
  } catch (err) {
    console.log('Error when fetching events:', err);
  }
});
</script>

<style scoped>
/* Styles specific to this search page */
</style>
