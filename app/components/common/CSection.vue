<script setup lang="ts">
interface Props {
  backgroundColor?: string
  containerClass?: string
  id?: string
}

defineProps<Props>()
</script>

<template>
  <section
    :id
    :style="{
      backgroundColor: backgroundColor
        ? `var(--color-${backgroundColor})`
        : 'var(--color-background)'
    }"
  >
    <UContainer :class="['py-24', containerClass]">
      <slot />
    </UContainer>
  </section>
</template>