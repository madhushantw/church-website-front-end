<script setup lang="ts">
import { SermonPdfType, type SermonItem } from '~/services/sermons.service'

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

const pdfLabel = (type: SermonPdfType) => {
  if (type === SermonPdfType.SERMON) return 'Sermon'
  return type
}
</script>

<template>
  <article
    class="group overflow-hidden rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md bg-white"
  >
    <div class="flex h-52 items-center justify-center bg-muted">
      <UIcon name="lucide:file-text" size="64" class="text-primary/60" />
    </div>
    <div class="p-6">
      <div class="mb-3 flex items-center justify-between gap-4">
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

      <p v-if="sermon.description" class="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
        {{ sermon.description }}
      </p>

      <div v-if="sermon.pdfFiles.length" class="mt-5 flex flex-wrap gap-2">
        <a
          v-for="pdf in sermon.pdfFiles"
          :key="`${pdf.type}-${pdf.url}`"
          :href="pdf.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-md border border-primary/30 px-3 py-2 text-[12px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <UIcon name="lucide:file-down" size="14" />
          {{ pdfLabel(pdf.type) }}
        </a>
      </div>
    </div>
  </article>
</template>
