<script setup lang="ts">
import type { EventItem } from "~/services/events.service";

interface Props {
  event: EventItem;
  canEdit?: boolean
}

defineProps<Props>();
const isDescriptionExpanded = ref(false);
const emit = defineEmits<{
  edit: [event: EventItem]
  delete: [event: EventItem]
}>()
</script>

<template>
  <div
    class="group relative isolate flex cursor-pointer gap-5 overflow-hidden rounded-3xl border border-primary/10 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:gap-6 sm:p-6"
  >
    <!-- Decorative blob -->
    <div
      class="pointer-events-none absolute -right-14 -top-14 -z-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/20"
    />

    <!-- Left accent bar -->
    <span
      class="absolute left-0 top-0 h-0 w-1 bg-linear-to-b from-primary to-primary/20 transition-all duration-500 group-hover:h-full"
    />

    <!-- Date badge -->
    <div class="w-18 shrink-0">
      <div
        class="overflow-hidden rounded-2xl border border-primary/15 text-center shadow-sm transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105"
      >
        <div
          class="bg-linear-to-br from-primary to-primary/70 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
        >
          {{ formatDate(event.startDate, 'MMM') }}
        </div>
        <div
          class="bg-primary/5 py-2.5 font-['Playfair_Display'] text-3xl font-bold leading-none text-foreground"
        >
          {{ formatDate(event.startDate, 'D') }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <h3
        class="mb-2 font-['Playfair_Display'] text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
      >
        {{ event.title }}
      </h3>

      <p
        class="mb-1 text-[13px] leading-relaxed text-muted-foreground"
        :class="isDescriptionExpanded ? 'whitespace-pre-line' : 'line-clamp-3'"
      >
        {{ event.description }}
      </p>

      <UButton
        v-if="event.description"
        :label="isDescriptionExpanded ? 'Show less' : 'Read more'"
        :aria-expanded="isDescriptionExpanded"
        color="primary"
        variant="link"
        size="xs"
        class="mb-3 px-0"
        @click.stop="isDescriptionExpanded = !isDescriptionExpanded"
      />

      <!-- Meta chips -->
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary"
        >
          <UIcon name="lucide:clock" size="13" />
          {{ formatDate(event.startDate, 'h:mm A') }}
        </span>

        <span
          v-if="event.location"
          class="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary"
        >
          <UIcon name="lucide:map-pin" size="13" />
          <span class="truncate">{{ event.location }}</span>
        </span>
      </div>
    </div>

    <!-- Admin actions -->
    <div v-if="canEdit" class="shrink-0 self-start">
      <div
        class="flex items-center gap-0.5 rounded-full border border-primary/10 bg-white/80 p-0.5 shadow-sm backdrop-blur transition-all duration-300 sm:translate-x-1 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100"
      >
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Edit event"
          class="rounded-full"
          @click.stop="emit('edit', event)"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="xs"
          aria-label="Delete event"
          class="rounded-full"
          @click.stop="emit('delete', event)"
        />
      </div>
    </div>
  </div>
</template>
