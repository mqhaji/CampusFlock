<template>
    <v-col cols="12" sm="6" md="4">
      <v-card class="event-card">
        <v-card-title>{{ event.title }}</v-card-title>
        <v-card-subtitle>
          {{ formatDate(event.startAt, { dateOnly: true }) }} | 
          {{ formatDate(event.startAt) }} - {{ formatDate(event.endAt) }}
          <br>
          Organized by: {{ event.organizer?.name || event.organizerName || 'Unknown Organizer' }}
        </v-card-subtitle>
        <v-card-text class="card-text">{{ event.description }}</v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="emitOpen">
            Learn More
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    event: Object,
  });
  
  const emit = defineEmits(['open']);
  
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
  
  function emitOpen() {
    emit('open', props.event);
  }
  </script>
  
  <style scoped>
  .event-card {
    display: flex;
    flex-direction: column;
    height: 100%; /* Ensures all cards are the same height */
  }
  
  .card-text {
    flex: 1; /* Makes the text section flex to fill available space */
    overflow: hidden; /* Hides overflow text */
    text-overflow: ellipsis; /* Adds ellipsis to overflow text */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; /* Limits the text block to 3 lines */
  }
  </style>
  
