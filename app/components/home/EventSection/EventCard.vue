<script setup lang="ts">
import type { EventItem } from "~/services/events.service";

interface Props {
  event: EventItem;
  canEdit?: boolean
}

defineProps<Props>();
const emit = defineEmits<{
  edit: [event: EventItem]
  delete: [event: EventItem]
}>()
</script>

<template>
  <div
    class="group flex cursor-pointer gap-6 rounded-lg bg-white border border-primary/20 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-sm"
  >
    <div class="w-16 shrink-0 text-center">
      <div
        class="rounded-t-md bg-primary py-1.5 text-[11px] font-medium uppercase tracking-widest text-white"
      >
        {{ formatDate(event.startDate, "MMM") }}
      </div>
      <div
        class="rounded-b-md bg-secondary py-2 font-['Playfair_Display'] text-2xl font-bold text-foreground"
      >
        {{ formatDate(event.startDate, "D") }}
      </div>
    </div>
    <div class="min-w-0 flex-1">
      <h3
        class="mb-2 font-['Playfair_Display'] text-[17px] font-medium text-foreground transition-colors group-hover:text-primary"
      >
        {{ event.title }}
      </h3>
      <p class="mb-3 text-[13px] leading-relaxed text-muted-foreground">
        {{ event.description }}
      </p>
      <div class="flex flex-wrap gap-x-4 gap-y-2">
        <div
          class="flex items-center gap-1.5 text-[12px] text-muted-foreground"
        >
          <UIcon name="lucide:clock" size="14" />
          <span>{{ formatDate(event.startDate, "h:mm A") }}</span>
        </div>
        <div
          v-if="event.location"
          class="flex items-center gap-1.5 text-[12px] text-muted-foreground"
        >
          <UIcon name="lucide:map-pin" size="14" />
          <span>{{ event.location }}</span>
        </div>
      </div>
    </div>
    <div class="hidden shrink-0 sm:block">
      <div v-if="canEdit" class="flex items-center gap-1">
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Edit sermon"
          class="rounded-full"
          @click="emit('edit', event)"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="xs"
          aria-label="Delete sermon"
          class="rounded-full"
          @click="emit('delete', event)"
        />
      </div>
    </div>
  </div>
</template>
