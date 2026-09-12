<script setup lang="ts">
interface Ministry {
  id: string;
  title: string;
  image?: string;
  subtitle: string;
  icon?: string;
  iconColor?: string;
}

interface Props {
  ministry: Ministry;
  canDelete?: boolean;
  canEdit?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  delete: [ministry: Ministry];
  edit: [ministry: Ministry];
}>();
</script>

<template>
  <div
    class="group cursor-pointer rounded-lg border border-primary/10 bg-white p-7 transition-all hover:border-primary/30 hover:shadow-md"
  >
    <div class="mb-5 flex items-start justify-between gap-3">
      <div
        class="flex h-14 w-14 items-center justify-center rounded-lg transition-colors"
      :style="{
        backgroundColor: `color-mix(in srgb, var(--color-${ministry.iconColor || 'primary'}) 10%, transparent)`,
      }"
      >
        <UIcon
          :name="ministry.icon || 'lucide:church'"
          size="26"
          :style="{
            color: `var(--color-${ministry.iconColor || 'primary'})`,
          }"
        />
      </div>
      <div v-if="props.canEdit || props.canDelete" class="flex items-center gap-1">
        <UButton
          v-if="props.canEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Edit ministry"
          class="rounded-full"
          @click="emit('edit', ministry)"
        />
        <UButton
          v-if="props.canDelete"
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="xs"
          aria-label="Delete ministry"
          class="rounded-full"
          @click="emit('delete', ministry)"
        />
      </div>
    </div>

    <h3
      class="mb-3 font-['Playfair_Display'] text-[18px] font-medium text-foreground transition-colors group-hover:text-primary"
    >
      {{ ministry.title }}
    </h3>

    <p class="text-[14px] leading-relaxed text-muted-foreground">
      {{ ministry.subtitle }}
    </p>

    <div
      class="mt-4 flex items-center gap-1 text-[13px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
    >
      Learn more

      <UIcon
        name="lucide:arrow-right"
        size="15"
        class="transition-transform group-hover:translate-x-1"
      />
    </div>
  </div>
</template>
