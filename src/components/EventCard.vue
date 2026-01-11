<template>
  <v-col cols="12" sm="6" md="4">
    <v-card class="event-card">
      <v-card-title>{{ event.title }}</v-card-title>
      <v-card-subtitle>
        {{ formatDate(event.startAt, { dateOnly: true }) }} |
        {{ formatDate(event.startAt) }} - {{ formatDate(event.endAt) }}
        <br>
        Organized by: {{ organizerName }}
      </v-card-subtitle>
      <v-card-text class="card-text">{{ event.description }}</v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" variant="text" @click="emitOpen">
          Learn More
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Event } from '@/types/models';

const props = defineProps<{
  event: Event;
}>();

const emit = defineEmits<{
  (event: 'open', payload: Event): void;
}>();

// Format date/time strings for the card subtitle.
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

// Resolve organizer display name from populated or legacy data.
const organizerName = computed(() => {
  const organizer = props.event.organizer;
  if (organizer && typeof organizer !== 'string') {
    return organizer.name;
  }
  return props.event.organizerName || 'Unknown Organizer';
});

// Emit to parent so it can open the details dialog.
function emitOpen() {
  emit('open', props.event);
}
</script>

<style scoped>
.event-card {
  display: flex;
  flex-direction: column;
  /* Ensures all cards are the same height */
  height: 100%;
}

.card-text {
  /* Makes the text section flex to fill available space */
  flex: 1;
  /* Hides overflow text */
  overflow: hidden;
  /* Adds ellipsis to overflow text */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* Limits the text block to 3 lines */
  -webkit-line-clamp: 3;
}
</style>
