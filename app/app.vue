<script setup lang="ts">
import { useChurchInfoStore } from "~/stores/church-info.store";
import { useUserStore } from "~/stores/user.store";

const userStore = useUserStore();
const churchInfoStore = useChurchInfoStore();

await userStore.restoreSession();
await churchInfoStore.fetchChurchInfo();
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>