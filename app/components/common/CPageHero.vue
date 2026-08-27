<script setup lang="ts">
import { CButton } from "~/components/common"

interface Button {
  title: string
  color?: string
  outlined?: boolean
  appendIcon?: string
}

interface Props {
  image: string
  label: string
  title: string
  highlighted?: string
  description?: string
  buttons?: Button[]
  alt?: string
}

withDefaults(defineProps<Props>(), {
  alt: '',
  highlighted: undefined,
  description: undefined,
  buttons: () => [],
})
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0">
      <img
        :src="image"
        :alt="alt"
        class="h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/15" />

      <div
        class="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent"
      />
    </div>

    <UContainer class="relative">
      <div class="flex min-h-115 items-center py-24 lg:min-h-130">
        <div class="max-w-2xl">
          <!-- Label -->
          <div class="mb-6 flex items-center gap-3">
            <div class="h-px w-10 bg-accent" />

            <span
              class="text-[12px] font-medium uppercase tracking-[0.25em] text-accent"
            >
              {{ label }}
            </span>
          </div>

          <h1
            class="font-['Playfair_Display'] text-5xl font-normal leading-tight text-white md:text-6xl lg:text-7xl"
          >
            {{ title }}

            <span
              v-if="highlighted"
              class="italic text-secondary"
            >
              {{ highlighted }}
            </span>
          </h1>

          <p
            v-if="description"
            class="mt-6 max-w-xl text-[16px] leading-relaxed text-white/70 md:text-lg"
          >
            {{ description }}
          </p>

          <div
            v-if="buttons.length"
            class="mt-8 flex flex-wrap gap-4"
          >
            <CButton
              v-for="button in buttons"
              :key="button.title"
              :title="button.title"
              :color="button.color || 'accent'"
              :outlined="button.outlined"
              :append-icon="button.appendIcon"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>