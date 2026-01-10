<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import ProfilePicEditor from './ProfilePicEditor.vue';

const name = ref<string>('');
const bio = ref<string>('');
const interests = ref<string[]>([]);
const profilePicDialog = ref<boolean>(false);

const chipInput = ref<string>('')
const chips = ref<string[]>([]);

function onClickProfilePic() {
    profilePicDialog.value = true;
}

function addChip() {
  const trimmedInput = chipInput.value.trim();
  if (trimmedInput && !chips.value.includes(trimmedInput)) {
    chips.value.push(trimmedInput);
    interests.value = [...chips.value];
  }
  chipInput.value = '';
}

function removeChip(index: number) {
  chips.value.splice(index, 1);
  interests.value = [...chips.value];
};

onBeforeMount(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        const data = await response.json();
        const user = data[0];

        name.value = user.name;
        bio.value = user.bio || '';
        interests.value = Array.isArray(user.interests) ? user.interests : [];
        chips.value = [...interests.value];
    } catch (err) {
        console.log('Error when fetching user data:', err);
    }
});
</script>


<template>
    <v-container>
        <v-row>
            <v-col class="d-flex align-center">
                <h3>Your Profile</h3>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="auto" class="d-flex align-center">
                <v-avatar color="purple" size="64" @click="onClickProfilePic()" style="cursor: pointer">
                    <h2 id="avatar-text">FL</h2>
                </v-avatar>
            </v-col>
            <v-col>
                <v-text-field v-model="name" label="Name" hide-details="auto"></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-textarea v-model="bio" label="Describe yourself" hide-details="auto"></v-textarea>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-text-field v-model="chipInput" @keyup.enter="addChip"
                    label="Add your interests (press enter for each one)" outlined clearable></v-text-field>

                <v-chip-group v-model="chips" column>
                    <v-chip v-for="(chip, index) in chips" :key="index" close @click:close="removeChip(index)">
                        {{ chip }}
                    </v-chip>
                </v-chip-group>
            </v-col>
        </v-row>

        <ProfilePicEditor v-model="profilePicDialog" />
    </v-container>
</template>

<style scoped>
#avatar-text {
    font-size: 2em;
    font-weight: 300;
}
</style>


<style scoped>
#avatar-text {
    font-size: 2em;
    font-weight: 300;
}
</style>
