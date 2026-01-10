<script setup lang="ts">
import { useDisplay } from 'vuetify';
import ProfileEditor from '../components/settings/ProfileEditor.vue';
import { onBeforeMount, ref } from 'vue';
import type { User } from '@/types/models';

const { smAndUp } = useDisplay();

const user = ref<User | null>(null);

onBeforeMount(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/users')
        const data = await response.json() as User[];
        // Temporary: use the first user until auth is implemented.
        user.value = data[0] ?? null;
    } catch (err) {
        console.log('Error when fetching user data:', err);
    }
})
</script>

<template>
    <v-container>
        <v-card>
            <v-card-title>My Profile</v-card-title>
            <v-card-text>

                <v-row>
                    <v-col class="pa-4" cols="auto">
                        <v-row>
                            <v-col cols="auto" class="d-flex align-center">
                                <v-avatar color="purple">{{ user?.name.charAt(0) ?? '' }}</v-avatar>
                            </v-col>
                            <v-col cols="auto" class="d-flex align-center">
                                <h3>{{ user?.name ?? '' }}</h3>
                            </v-col>
                        </v-row>
                    </v-col md="12">

                    <v-divider v-if="smAndUp" class="ma-5" vertical />

                    <v-col>
                        <h1>Settings</h1>
                        <ProfileEditor />
                    </v-col>
                </v-row>

            </v-card-text>
        </v-card>
    </v-container>
</template>
