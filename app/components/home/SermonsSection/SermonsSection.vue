<script setup lang="ts">
import { CSection, CSectionHeading } from "../../common";
import SermonCard from "./components/SermonCard.vue";
import { SermonsService, type SermonItem } from "~/services/sermons.service";

defineProps<{ hideNavigationButton?: boolean }>();

const { items: sermons, loading, error } = useApiList<SermonItem>(
  "sermons",
  SermonsService.getAll,
  "Failed to load sermons",
);
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

    <div v-if="loading" class="text-center py-8">Loading sermons...</div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>

    <div
      v-else-if="sermons.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <SermonCard v-for="sermon in sermons" :key="sermon.id" :sermon="sermon" />
    </div>

    <div v-else class="text-center py-8">No sermons found</div>
  </CSection>
</template>
