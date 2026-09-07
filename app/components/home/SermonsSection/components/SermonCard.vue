<script setup lang="ts">
import type { SermonItem } from '~/services/sermons.service'

interface Props {
  sermon: SermonItem
}

defineProps<Props>()

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
</script>

<template>
  <article
    class="group cursor-pointer overflow-hidden rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md bg-white"
  >
    <div class="relative overflow-hidden">
      <img
        v-if="sermon.image"
        :src="sermon.image"
        :alt="sermon.title"
        class="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
      <div v-else class="h-52 w-full bg-muted" />
      <div
        class="absolute inset-0 bg-foreground/30 transition-colors group-hover:bg-foreground/20"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform duration-200 hover:bg-white group-hover:scale-105"
        >
          <UIcon name="line-md:play-filled" size="44" class="text-primary" />
        </div>
      </div>
    </div>
    <div class="p-6">
      <div class="mb-3 flex items-center justify-between gap-4">
        <span
          v-if="sermon.bibleReference"
          class="text-[11px] font-medium uppercase tracking-widest text-accent"
        >
          {{ sermon.bibleReference }}
        </span>

        <span class="whitespace-nowrap text-[12px] text-muted-foreground">
          {{ formatDate(sermon.sermonDate) }}
        </span>
      </div>

      <h3
        class="mb-2 font-['Playfair_Display'] text-[18px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary"
      >
        {{ sermon.title }}
      </h3>

      <p class="text-[13px] text-muted-foreground">
        {{ sermon.preacher }}
      </p>
    </div>
  </article>
</template>
