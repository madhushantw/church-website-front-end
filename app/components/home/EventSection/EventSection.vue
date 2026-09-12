<script setup lang="ts">
import { useUserStore } from "~/stores/user.store";
import { EventsService, type EventItem } from "~/services/events.service";
import { UserRole } from "~/services/users.service";
import {
  CSection,
  CSectionHeading,
  ConfirmationDialog,
} from "~/components/common";
import EventCard from "./EventCard.vue";
import EventDialog from "./EventDialog.vue";

const props = defineProps<{
  hideNavigationButton?: boolean;
  allowCreate?: boolean;
}>();

const userStore = useUserStore();
const deleteDialogOpen = ref(false);
const selectedItem = ref<EventItem | null>(null);
const isEventDialogOpen = ref(false);

const {
  items: events,
  loading,
  error,
} = useApiList<EventItem>(
  "events",
  EventsService.getAll,
  "Failed to load events",
);

const canManageEvents = computed(
  () => props.allowCreate && userStore.user?.role === UserRole.ROOT,
);

const openCreate = () => {
  selectedItem.value = null;
  isEventDialogOpen.value = true;
};

const onSave = (event: EventItem) => {
  const index = events.value.findIndex((item) => item.id === event.id);
  if (index !== -1) events.value[index] = event;
  else events.value = [event, ...events.value];
  isEventDialogOpen.value = false;
  selectedItem.value = null;
};

const openDelete = (item: EventItem) => {
  selectedItem.value = item;
  deleteDialogOpen.value = true;
};

const onDelete = async () => {
  if (!selectedItem.value) return;
  try {
    await EventsService.delete(selectedItem.value?.id);
    events.value = events.value.filter(
      (events) => events.id !== selectedItem.value?.id,
    );
    deleteDialogOpen.value = false;
    selectedItem.value = null;
  } catch (e) {
    console.error(e);
  }
};

const openEdit = (item: EventItem) => {
  selectedItem.value = item;
  isEventDialogOpen.value = true
};

watch(() => isEventDialogOpen.value, open => {
  if (!open) selectedItem.value = null
})
</script>

<template>
  <CSection id="events">
    <div class="flex justify-between items-center">
      <CSectionHeading label="Calendar" title="Upcoming Events" />
      <div class="mb-6 flex items-center gap-4">
        <button
          v-if="canManageEvents"
          class="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
          @click="openCreate"
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
    <div v-if="loading" class="text-center py-8">Loading events...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>
    <div
      v-else-if="events.length > 0"
      class="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        :can-edit="canManageEvents"
        @delete="openDelete"
        @edit="openEdit"
      />
    </div>
    <div v-else class="text-center py-8">No events found</div>
    <EventDialog
      v-model="isEventDialogOpen"
      :event="selectedItem"
      @saved="onSave"
    />
    <ConfirmationDialog
      v-model="deleteDialogOpen"
      type="delete"
      title="Delete event?"
      :subtitle="`This will permanently remove ${selectedItem?.title}.`"
      @confirm="onDelete"
    />
  </CSection>
</template>
