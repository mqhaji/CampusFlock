<template>
  <v-app>
    <v-navigation-drawer
      v-if="!display.mobile"
      v-model="drawer"
      permanent
      app
    >
      <v-list>
        <v-list-item @click="navigateTo('/home')" link>
          <v-icon>mdi-home</v-icon>
          Home
        </v-list-item>

        <v-list-item @click="navigateTo('/profile')" link>
          <v-icon>mdi-account</v-icon>
          Profile
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-bottom-navigation
      v-else
      app
      grow
      v-model="activeTab"
    >
      <v-btn @click="navigateTo('/home')" value="/home">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn @click="navigateTo('/profile')" value="/profile">
        <span>Profile</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-app-bar app color="primary" dark>
      <v-row class="d-flex align-center">

        <v-col cols="4">
          <v-toolbar-title class="ma-4" @click="navigateTo('/home')"style="cursor:pointer;">CampusFlock</v-toolbar-title>
        </v-col>

        <v-col cols="4" class="d-flex justify-center">
          <v-text-field dense flat hide-details solo-inverted placeholder="Search..."
            v-model="searchQuery" @keyup.enter="handleSearch"
            class="search-bar d-flex-inline justify-self-center">
            <template #append-inner>
              <v-btn
                icon="mdi-magnify"
                variant="text"
                size="small"
                aria-label="Search"
                @click="handleSearch"
              />
              <v-btn
                v-if="searchQuery"
                icon="mdi-close"
                variant="text"
                size="small"
                aria-label="Clear search"
                @click="clearSearch"
              />
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="4" class="d-flex justify-end">
          <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" class="ma-4"></v-btn>
        </v-col>

      </v-row>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-btn fab color="primary" class="floating-button" @click="onCreateEventClick()" icon="mdi-plus" />

    <CreateEvent v-model="createEventDialog" />
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router';
import { useDisplay, useTheme } from 'vuetify';
import CreateEvent from './components/CreateEvent.vue';

const router = useRouter();
const route = useRoute();
const display = useDisplay();
const theme = useTheme();

const drawer = ref(false);
const activeTab = ref<string>(route.path);
const searchQuery = ref<string>('');  // Store the search query input
let searchTimer: ReturnType<typeof setTimeout> | undefined;
let systemThemeMedia: MediaQueryList | null = null;

watch(() => route.path, (newPath) => {
  activeTab.value = newPath;
});
const createEventDialog = ref(false)

function applySystemTheme(isDark: boolean) {
  theme.global.name.value = isDark ? 'dark' : 'light';
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  applySystemTheme(event.matches);
}

onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return;
  }

  systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  applySystemTheme(systemThemeMedia.matches);

  if (systemThemeMedia.addEventListener) {
    systemThemeMedia.addEventListener('change', handleSystemThemeChange);
  } else if (systemThemeMedia.addListener) {
    systemThemeMedia.addListener(handleSystemThemeChange);
  }
});

onBeforeUnmount(() => {
  if (!systemThemeMedia) {
    return;
  }

  if (systemThemeMedia.removeEventListener) {
    systemThemeMedia.removeEventListener('change', handleSystemThemeChange);
  } else if (systemThemeMedia.removeListener) {
    systemThemeMedia.removeListener(handleSystemThemeChange);
  }
});

function navigateTo(targetRoute: string) {
  // Check if the new route is different from the current one
  if (targetRoute !== router.currentRoute.value.path) {
    router.push(targetRoute);
    activeTab.value = targetRoute; // Only update if the route changes
    if (display.mobile) {
      drawer.value = false; // Close the drawer on mobile after navigation
    }
  }
}

function updateSearchRoute(value: string, replace: boolean = false) {
  const trimmed = value.trim();
  if (!trimmed) {
    if (route.path !== '/home') {
      router.push('/home');
    }
    return;
  }
  const target = {
    name: 'SearchPage',
    query: trimmed ? { query: trimmed } : {},
  };

  if (route.name !== 'SearchPage') {
    router.push(target);
    return;
  }

  if (replace) {
    router.replace(target);
  } else {
    router.push(target);
  }
}

watch(searchQuery, (value: string) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    updateSearchRoute(value, true);
  }, 200);
});

watch(
  () => route.query.query,
  (value: LocationQueryValue | LocationQueryValue[] | undefined) => {
    const nextValue = typeof value === 'string' ? value : '';
    if (nextValue !== searchQuery.value) {
      searchQuery.value = nextValue;
    }
  }
);

function handleSearch() {
  updateSearchRoute(searchQuery.value);
}

function clearSearch() {
  searchQuery.value = '';
  updateSearchRoute('');
}

function onCreateEventClick() {
  createEventDialog.value = true;
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.floating-button {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 100;
}
</style>
