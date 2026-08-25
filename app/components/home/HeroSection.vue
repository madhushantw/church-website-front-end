<script setup lang="ts">
import { CButton } from '../common';

</script>

<template>
  <section
    id="home"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <img
      src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&h=900&fit=crop&auto=format"
      alt="Congregation in worship"
      class="absolute inset-0 w-full h-full object-cover -z-20"
    >
    <div class="absolute inset-0 bg-linear-to-b from-[#1C2B2A]/75 via-[#1C2B2A]/55 to-[#1C2B2A]/80" />
    <UContainer class="relative z-10 text-center px-6 max-w-4xl mx-auto">
      <div class="inline-flex items-center gap-2 mb-8">
        <div class="h-px w-8 bg-accent" />
        <span
          class="text-accent text-[13px] tracking-[0.25em] uppercase font-medium"
        >
          Welcome Home
        </span>
        <div class="h-px w-8 bg-accent" />
      </div>
      <h1
        class="text-white text-6xl md:text-7xl lg:text-8xl leading-tight mb-6 font-['Playfair_Display']"
      >
        A Place of Faith,
        <br>
        <span class="italic text-accent">Hope & Community</span>
      </h1>
      <p
        class="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light"
      >
        We are a family of believers committed to worship, growth, and serving one another and our community. All are welcome here.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <CButton title="Discover Our Church" />
        <CButton title="Watch a Sermon" outlined color="neutral" prepend-icon="solar:play-outline" />
      </div>
    </UContainer>
  </section>
</template>
