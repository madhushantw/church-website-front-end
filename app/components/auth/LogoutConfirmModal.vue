<script setup lang="ts">
import { useUserStore } from "~/stores/user.store";

const open = defineModel<boolean>("open", { default: false });
const userStore = useUserStore();

const logout = () => {
  localStorage.removeItem("accessToken");
  userStore.user = null;
  open.value = false;
};
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content: 'max-w-md rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <div class="p-6 sm:p-8">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Account
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              Sign out?
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              Are you sure you want to sign out of Grace Community?
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close sign out dialog"
            class="rounded-full"
            @click="open = false"
          />
        </div>

        <div class="flex justify-end gap-3">
          <UButton
            label="Cancel"
            color="neutral"
            variant="soft"
            class="rounded-xl"
            @click="open = false"
          />
          <UButton
            label="Sign out"
            icon="i-lucide-log-out"
            color="primary"
            class="rounded-xl"
            @click="logout"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
