<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';

const show = defineModel<boolean>();
const eventTitle = ref("");
const dateString = ref<string>("");
const eventPic = ref<File | null>(null);

const date = computed<Date | null>({
    get: (): Date | null => {
        return validateDateInput(dateString.value) ? new Date(dateString.value) : null;
    },
    set: (val: Date | null) => {
        dateString.value = val ? formatDate(val) : "";
    }
})

function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function validateDateInput(input: string): boolean {
    const parsedDate = new Date(input);
    return !isNaN(parsedDate.getTime());
}

watch(dateString, (newVal) => {
    if (!validateDateInput(newVal)) {
        dateString.value = "";
    }
});

function close() {
    show.value = false;
}

function create() {
    // TODO: wire up API call for event creation.
    close();
}
</script>

<template>
    <v-dialog v-model="show" persistent no-click-animation>
        <v-card>
            <v-card-title>
                Create Event
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col>
                        <v-text-field v-model="eventTitle" label="Event Title" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-textarea label="Add a description" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-text-field v-model="dateString" label="When is your event?">
                            <v-menu activator="parent">
                                <v-date-picker v-model="date"></v-date-picker>
                            </v-menu>
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-file-input v-model="eventPic" label="Upload a banner image" accept="image/*"></v-file-input>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-btn @click="close()" color="red">Close</v-btn>
                <v-btn @click="create()" color="primary">Create</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.v-dialog {
    max-width: max(60%, 400px);
}
</style>
