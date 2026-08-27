<script setup lang="ts">
import { CSection, CSectionHeading } from "../../common";
import SermonCard from "./components/SermonCard.vue";

defineProps<{ hideNavigationButton?: boolean }>();

const sermons = [
  {
    title: "Walking in Faith Through Uncertainty",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=380&fit=crop&auto=format",
    scripture: "Hebrews 11:1–6",
    date: "June 29, 2025",
    preacher: "Fr. James Callahan",
    duration: "42 min",
  },
  {
    title: "Walking in Faith Through Uncertainty",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=380&fit=crop&auto=format",
    scripture: "Hebrews 11:1–6",
    date: "June 29, 2025",
    preacher: "Fr. James Callahan",
    duration: "42 min",
  },
  {
    title: "Walking in Faith Through Uncertainty",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=380&fit=crop&auto=format",
    scripture: "Hebrews 11:1–6",
    date: "June 29, 2025",
    preacher: "Fr. James Callahan",
    duration: "42 min",
  },
];
</script>

<template>
  <CSection id="sermons" background-color="muted">
    <div class="flex justify-between items-center">
      <CSectionHeading label="Messages" title="Latest Sermons" />
      <button
        v-if="!hideNavigationButton"
        class="mb-6 flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-primary transition-colors hover:text-primary/70"
        @click="navigateTo('sermons')"
      >
        View all messages
        <UIcon name="lucide:chevron-right" size="16" />
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <SermonCard v-for="(sermon, idx) in sermons" :key="idx" v-bind="sermon" />
    </div>
  </CSection>
</template>
