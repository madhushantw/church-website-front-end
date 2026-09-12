<script setup lang="ts">
import { useUserStore } from "~/stores/user.store";

const userStore = useUserStore();

await userStore.restoreSession();
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>