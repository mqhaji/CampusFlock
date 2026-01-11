<script setup lang="ts">
import { ref } from 'vue';

const show = defineModel<boolean>()
const profilePic = ref<File | null>(null)

// Submit the chosen file (hook up the API later).
function onSubmit() {
    if (profilePic) {
        // TODO submit to database
    }
    show.value = false
}

// Close without saving changes.
function onCancel() {
    // close dialog and don't submit
    show.value = false
}
</script>

<template>
    <v-dialog v-model="show">
        <v-card>
            <v-card-title>Upload a Profile Picture</v-card-title>
            <v-card-text>
                <v-file-input v-model="profilePic" label="Upload..." accept="image/*"></v-file-input>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="onCancel" color="red">Cancel</v-btn>
                <v-btn @click="onSubmit" color="primary">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.v-dialog {
    max-width: max(40%, 400px);
}
</style>
