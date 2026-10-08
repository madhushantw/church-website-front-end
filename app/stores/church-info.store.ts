import { ref } from "vue";
import { defineStore } from "pinia";

import {
  ChurchInfoService,
  type ChurchInfo,
} from "~/services/church-info.service";

export const useChurchInfoStore = defineStore("church-info", () => {
  const churchInfo = ref<ChurchInfo | null>(null);
  const isLoading = ref(false);
  const hasLoaded = ref(false);

  const restoreChurchInfo = async () => {
    if (!import.meta.client || isLoading.value || hasLoaded.value) return;

    isLoading.value = true;

    try {
      const response = await ChurchInfoService.get();
      churchInfo.value = response.data ?? null;
      return churchInfo.value;
    } catch {
      churchInfo.value = null;
    } finally {
      isLoading.value = false;
      hasLoaded.value = true;
    }
  };

  const fetchChurchInfo = async () => restoreChurchInfo();

  const reset = () => {
    churchInfo.value = null;
    isLoading.value = false;
    hasLoaded.value = false;
  };

  return {
    churchInfo,
    isLoading,
    hasLoaded,
    fetchChurchInfo,
    reset,
  };
});
