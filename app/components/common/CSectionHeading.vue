<script setup lang="ts">
interface Props {
  label: string
  title: string
  highlighted?: string
  headerClass?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <div class="h-px w-8 bg-accent" />
      <span
        class="text-[12px] font-medium uppercase tracking-[0.22em] text-accent"
      >
        {{ label }}
      </span>
    </div>
    <h2
      class="mb-6 font-['Playfair_Display'] text-5xl font-normal leading-tight text-foreground"
      :class="headerClass"
    >
      {{ title }}
      <span
        v-if="highlighted"
        class="italic text-primary"
      >
        {{ highlighted }}
      </span>
    </h2>
  </div>
</template>