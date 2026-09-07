<script setup lang="ts">
import { useUserStore } from "~/stores/user.store";

const userStore = useUserStore();

onMounted(() => {
  userStore.restoreSession();
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>