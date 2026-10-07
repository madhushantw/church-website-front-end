<script setup lang="ts">
import { EventsService, type EventItem } from "~/services/events.service";
import { CInput } from "~/components/common";
import dayjs from "dayjs";

interface EventForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isFeatured: boolean;
}

const open = defineModel<boolean>({ default: false });
const props = defineProps<{
  event?: EventItem | null;
}>();
const emit = defineEmits<{
  saved: [event: EventItem];
}>();

const initialForm = (): EventForm => ({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  isFeatured: false,
});

const form = ref<EventForm>(initialForm());
const isLoading = ref(false);
const error = ref("");
const isEditing = computed(() => !!props.event);

const resetForm = () => {
  form.value = initialForm();
  error.value = "";
};

const loadItem = (item: EventItem) => {
  form.value = {
    title: item.title,
    description: item.description || "",
    startDate: dayjs(item.startDate).format("YYYY-MM-DDTHH:mm"),
    endDate: dayjs(item.endDate).format("YYYY-MM-DDTHH:mm"),
    location: item.location || "",
    isFeatured: item.isFeatured,
  };
  error.value = "";
};

const close = () => {
  if (isLoading.value) return;
  open.value = false;
  resetForm();
};

const createEvent = async () => {
  error.value = "";

  if (new Date(form.value.endDate) <= new Date(form.value.startDate)) {
    error.value = "The end time must be after the start time.";
    return;
  }

  isLoading.value = true;

  try {
    const response = props.event
      ? await EventsService.update(props.event.id, form.value)
      : await EventsService.create(form.value);

    emit("saved", response.data);
    open.value = false;
    resetForm();
  } catch {
    error.value = isEditing.value
      ? "Unable to update the event. Please try again."
      : "Unable to create the event. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

watch(open, (isOpen) => {
  if (isOpen) {
    if (props.event) loadItem(props.event);
    else resetForm();
  }
});

watch(
  () => props.event,
  (item) => {
    if (open.value && item) loadItem(item);
  },
);
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content:
        'w-full max-w-2xl overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form
        class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-4rem)]"
        @submit.prevent="createEvent"
      >
        <div
          class="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8"
        >
          <div>
            <p
              class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Community calendar
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              {{ isEditing ? "Edit event" : "Add an event" }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              {{
                isEditing
                  ? "Update this gathering in the church calendar."
                  : "Share a gathering with the church community."
              }}
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close add event dialog"
            class="shrink-0 rounded-full"
            @click="close"
          />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <div class="grid gap-4 sm:grid-cols-2">
            <CInput
              v-model="form.title"
              label="Event title"
              placeholder="Sunday gathering"
              required
              class="sm:col-span-2"
            />
            <CInput
              v-model="form.startDate"
              label="Starts"
              type="datetime-local"
              required
            />
            <CInput
              v-model="form.endDate"
              label="Ends"
              type="datetime-local"
              required
            />
            <CInput
              v-model="form.location"
              label="Location"
              placeholder="Main hall"
              class="sm:col-span-2"
            />
            <CInput
              v-model="form.description"
              label="Description"
              placeholder="Tell people what to expect"
              textarea
              class="sm:col-span-2"
            />
          </div>
          <label
            class="mt-5 flex items-center gap-3 text-sm text-foreground/70"
          >
            <UCheckbox v-model="form.isFeatured" />
            Feature this event
          </label>
          <p v-if="error" class="mt-4 text-sm text-red-600">
            {{ error }}
          </p>
        </div>
        <div
          class="flex shrink-0 justify-end gap-3 border-t border-primary/10 px-6 py-4 sm:px-8"
        >
          <UButton
            type="button"
            label="Cancel"
            color="neutral"
            variant="soft"
            class="rounded-xl"
            :disabled="isLoading"
            @click="close"
          />

          <UButton
            type="submit"
            :label="isEditing ? 'Save changes' : 'Create event'"
            :icon="isEditing ? 'i-lucide-save' : 'i-lucide-calendar-plus'"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
