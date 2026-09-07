<script setup lang="ts">
import { ref, onMounted } from "vue";
import { CSection, CSectionHeading } from "../../common";
import SermonCard from "./components/SermonCard.vue";
import { SermonsService, type SermonItem } from "~/services/sermons.service";

defineProps<{ hideNavigationButton?: boolean }>();

const sermons = ref<SermonItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    const { data } = await SermonsService.getAll();
    sermons.value = data;
  } catch (err) {
    console.error("Failed to fetch sermons:", err);
    error.value = "Failed to load sermons";
  } finally {
    loading.value = false;
  }
});
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
