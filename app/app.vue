<script setup lang="ts">
import { useChurchInfoStore } from "~/stores/church-info.store";
import { useUserStore } from "~/stores/user.store";

const userStore = useUserStore();
const churchInfoStore = useChurchInfoStore();

onMounted(async () => {
  try {
    await userStore.restoreSession();
    await churchInfoStore.fetchChurchInfo();
  } catch (e) {
    console.error(e);
  }
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
