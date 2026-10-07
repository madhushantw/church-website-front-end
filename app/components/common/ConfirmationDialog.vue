<script setup lang="ts">
type ConfirmationType = "delete" | "confirm" | "logout";

const props = defineProps<{
  title: string;
  subtitle?: string;
  type: ConfirmationType;
  loading?: boolean
}>();

const open = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const typeConfig = computed(() => {
  switch (props.type) {
    case "delete":
      return {
        eyebrow: "Confirm deletion",
        confirmColor: "error" as const,
        confirmIcon: "i-lucide-trash-2",
        confirmLabel: "Delete",
      };
    case "logout":
      return {
        eyebrow: "Confirm logout",
        confirmColor: "primary" as const,
        confirmIcon: "i-lucide-log-out",
        confirmLabel: "Log out",
      };
    case "confirm":
    default:
      return {
        eyebrow: "Please confirm",
        confirmColor: "primary" as const,
        confirmIcon: "i-lucide-check",
        confirmLabel: "Confirm",
      };
  }
});

const handleConfirm = () => emit("confirm");

const handleCancel = () => {
  open.value = false;
  emit('cancel')
};
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content: 'w-full max-w-sm overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <div class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-4rem)]">
        <div class="flex shrink-0 items-start justify-between gap-4 p-6 pb-3">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {{ typeConfig.eyebrow }}
            </p>
            <h2 class="font-['Playfair_Display'] text-2xl text-foreground">
              {{ title }}
            </h2>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close dialog"
            class="rounded-full"
            @click="handleCancel"
          />
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
          <p v-if="subtitle" class="text-sm text-muted-foreground">
            {{ subtitle }}
          </p>
        </div>

        <div class="flex shrink-0 justify-end gap-3 border-t border-primary/10 px-6 py-4">
          <UButton
            label="Cancel"
            color="neutral"
            variant="soft"
            class="rounded-xl"
            @click="handleCancel"
          />
          <UButton
            :label="typeConfig.confirmLabel"
            :icon="typeConfig.confirmIcon"
            :color="typeConfig.confirmColor"
            :loading="loading"
            class="rounded-xl"
            @click="handleConfirm"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>