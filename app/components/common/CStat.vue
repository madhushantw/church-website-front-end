<script setup lang="ts">
interface Props {
  value: string
  label: string
}

defineProps<Props>()
</script>

<template>
  <div class="border-l-2 border-accent pl-4">
    <div
      class="font-['Playfair_Display'] text-3xl font-bold text-primary"
    >
      {{ value }}
    </div>

    <div
      class="mt-0.5 text-[13px] uppercase tracking-wider text-muted-foreground"
    >
      {{ label }}
    </div>
  </div>
</template>