<script setup lang="ts">
import { SermonPdfType, type SermonItem } from "~/services/sermons.service";

interface Props {
  sermon: SermonItem;
  canEdit?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [sermon: SermonItem];
  delete: [sermon: SermonItem];
}>();

const pdfLabel = (type: SermonPdfType) => {
  if (type === SermonPdfType.SERMON) return "Sermon";
  return type;
};
</script>

<template>
  <article
    class="group relative isolate flex h-full min-h-72 cursor-pointer flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
  >
    <div
      class="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/20"
    />
    <div
      class="pointer-events-none absolute -bottom-20 -left-16 -z-10 h-44 w-44 rounded-full bg-primary/5 blur-3xl transition-all duration-700 group-hover:scale-125"
    />

    <span
      class="absolute left-0 top-0 h-1 w-0 bg-linear-to-r from-primary to-primary/30 transition-all duration-500 group-hover:w-full"
    />

    <div class="flex h-full flex-col p-6">
      <div class="mb-5 flex items-center justify-between gap-4">
        <span
          class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary"
        >
          <UIcon name="lucide:calendar" size="13" />
          {{ formatDate(sermon.sermonDate, "MMM D, YYYY") }}
        </span>

        <div
          v-if="props.canEdit"
          class="flex items-center gap-1 rounded-full border border-primary/10 bg-white/80 p-0.5 shadow-sm backdrop-blur transition-all duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="xs"
            aria-label="Edit sermon"
            class="rounded-full"
            @click.stop="emit('edit', sermon)"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="xs"
            aria-label="Delete sermon"
            class="rounded-full"
            @click.stop="emit('delete', sermon)"
          />
        </div>
      </div>

      <h3
        class="mb-3 font-['Playfair_Display'] text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
      >
        {{ sermon.title }}
      </h3>

      <div class="flex items-center gap-2.5">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-white shadow-sm"
        >
          <UIcon name="lucide:mic" size="14" />
        </span>
        <p class="text-sm font-medium text-muted-foreground">
          {{ sermon.preacher }}
        </p>
      </div>

      <p
        v-if="sermon.description"
        class="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground"
      >
        {{ sermon.description }}
      </p>

      <div
        v-if="sermon.pdfFiles?.length"
        class="mt-auto flex flex-wrap gap-2 border-t border-primary/10 pt-5"
      >
        <a
          v-for="pdf in sermon.pdfFiles"
          :key="`${pdf.type}-${pdf.url}`"
          :href="pdf.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group/pdf inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-[12px] font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20"
          @click.stop
        >
          <UIcon
            name="lucide:file-down"
            size="14"
            class="transition-transform duration-300 group-hover/pdf:translate-y-0.5"
          />
          {{ pdfLabel(pdf.type) }}
        </a>
      </div>
    </div>
  </article>
</template>
