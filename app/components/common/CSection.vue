<script setup lang="ts">
interface Props {
  backgroundColor?: string;
  containerClass?: string;
  id?: string;
  decorated?: boolean;
}

withDefaults(defineProps<Props>(), {
  backgroundColor: undefined,
  containerClass: undefined,
  id: undefined,
  decorated: true,
});
</script>

<template>
  <section
    :id
    class="relative isolate scroll-mt-20 overflow-hidden"
    :style="{
      backgroundColor: backgroundColor
        ? `var(--color-${backgroundColor})`
        : 'var(--color-background)',
    }"
  >
    <div
      v-if="decorated"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10"
    >
      <div
        class="absolute inset-0 opacity-[0.12] bg-[radial-gradient(var(--color-primary)_0.6px,transparent_0.6px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"
      />
      <div
        class="absolute -left-40 -top-40 h-112 w-md rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        class="absolute -bottom-40 -right-40 h-104 w-104 rounded-full bg-primary/5 blur-[120px]"
      />
    </div>

    <div
      aria-hidden="true"
      class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
    />

    <UContainer :class="['relative py-16 sm:py-20 lg:py-28', containerClass]">
      <slot />
    </UContainer>
  </section>
</template>
