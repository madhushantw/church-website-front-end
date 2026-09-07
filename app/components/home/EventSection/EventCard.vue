<script setup lang="ts">
import type { EventItem } from "~/services/events.service";

interface Props {
  event: EventItem;
}

defineProps<Props>();

const formatMonth = (dateStr: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
  })
    .format(new Date(dateStr))
    .toUpperCase();

const formatDay = (dateStr: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
  }).format(new Date(dateStr));

const formatTime = (dateStr: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateStr));
</script>

<template>
  <div
    class="group flex cursor-pointer gap-6 rounded-lg bg-white border border-primary/20 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-sm"
  >
    <div class="w-16 shrink-0 text-center">
      <div
        class="rounded-t-md bg-primary py-1.5 text-[11px] font-medium uppercase tracking-widest text-white"
      >
        {{ formatMonth(event.startDate) }}
      </div>

      <div
        class="rounded-b-md bg-secondary py-2 font-['Playfair_Display'] text-2xl font-bold text-foreground"
      >
        {{ formatDay(event.startDate) }}
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
          <span>{{ formatTime(event.startDate) }}</span>
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

    <!-- Arrow -->
    <div class="hidden shrink-0 self-center sm:block">
      <UIcon
        name="lucide:arrow-right"
        size="20"
        class="text-primary transition-transform duration-200 group-hover:translate-x-1"
      />
    </div>
  </div>
</template>
