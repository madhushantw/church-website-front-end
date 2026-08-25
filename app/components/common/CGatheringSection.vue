<script setup lang="ts">
defineProps<Props>();
interface Props {
  text: string;
  reference: string;
}
</script>

<template>
  <section
    class="relative overflow-hidden bg-primary py-20"
  >
    <div class="pointer-events-none absolute inset-0 select-none opacity-5">
      <div
        class="absolute left-0 top-0 font-['Playfair_Display'] text-[20rem] leading-none text-white"
      >
        “
      </div>
    </div>
    <div class="relative mx-auto max-w-3xl px-6 text-center">
      <p
        class="mb-6 font-['Playfair_Display'] text-3xl italic leading-relaxed text-white md:text-4xl lg:text-5xl"
      >
        “{{ text }}”
      </p>
      <div class="flex items-center justify-center gap-3">
        <div class="h-px w-12 bg-white/40" />
        <span class="text-[13px] uppercase tracking-widest text-white/70">
          {{ reference }}
        </span>
        <div class="h-px w-12 bg-white/40" />
      </div>
    </div>
  </section>
</template>
