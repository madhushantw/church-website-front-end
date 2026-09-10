<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from "~/stores/user.store";
import { CSection, CSectionHeading } from "~/components/common";
import EventCard from "./EventCard.vue";
import EventDialog from "./EventDialog.vue";
import { EventsService, type EventItem } from "~/services/events.service";

const props = defineProps<{
  hideNavigationButton?: boolean
  allowCreate?: boolean
}>();

const userStore = useUserStore();

const events = ref<EventItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const isEventDialogOpen = ref(false);

const addEvent = (event: EventItem) => {
  events.value = [event, ...events.value];
};

onMounted(async () => {
  try {
    loading.value = true;
    const response = await EventsService.getAll();
    events.value = response.data;
  } catch (err) {
    console.error('Failed to fetch events:', err);
    error.value = 'Failed to load events';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <CSection id="events">
    <div class="flex justify-between items-center">
      <CSectionHeading label="Calendar" title="Upcoming Events" />
      <div class="mb-6 flex items-center gap-4">
        <button
          v-if="props.allowCreate && userStore.user"
          class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
          @click="isEventDialogOpen = true"
        >
          <UIcon name="lucide:calendar-plus" size="16" />
          Add event
        </button>
        <button
          v-if="!hideNavigationButton"
          class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
          @click="navigateTo('events')"
        >
          Full Calendar
          <UIcon name="lucide:chevron-right" size="16" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      Loading events...
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="events.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
      />
    </div>

    <div v-else class="text-center py-8">
      No events found
    </div>

    <EventDialog v-model:open="isEventDialogOpen" @created="addEvent" />
  </CSection>
</template>
