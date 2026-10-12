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
    class="group relative isolate flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
  >
    <span
      class="absolute left-0 top-0 z-10 h-1 w-0 bg-linear-to-r from-primary to-primary/30 transition-all duration-500 group-hover:w-full"
    />
    <div
      class="relative overflow-hidden bg-linear-to-br from-primary/15 via-primary/5 to-transparent px-5 py-3.5"
    >
      <UIcon
        name="lucide:book-open"
        class="pointer-events-none absolute -bottom-4 -right-2 size-20 -rotate-12 text-primary/10 transition-all duration-700 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-primary/20"
      />
      <div class="relative flex items-center justify-between gap-4">
        <div
          class="inline-flex items-center gap-2 whitespace-nowrap text-lg text-foreground font-serif"
        >
          <UIcon
            name="lucide:calendar"
            class="size-[1em] shrink-0 text-primary"
            aria-hidden="true"
          />
          {{ formatDate(sermon.sermonDate, "MMM D, YYYY") }}
        </div>
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
    </div>

    <div class="flex flex-1 flex-col px-5 pb-5 pt-4">
      <h3
        class="mb-3 line-clamp-2 font-['Playfair_Display'] text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary"
      >
        {{ sermon.title }}
      </h3>
      <div
        v-if="sermon.preacher && sermon.preacher !== ' '"
        class="mb-4 flex items-center gap-2.5"
      >
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-white shadow-sm transition-transform duration-300 group-hover:scale-110"
        >
          <UIcon name="lucide:mic" size="14" />
        </span>
        <p class="min-w-0 truncate text-sm font-medium text-foreground">
          {{ sermon.preacher }}
        </p>
      </div>
      <div class="mt-auto border-t border-primary/10 pt-4">
        <div v-if="sermon.pdfFiles?.length" class="flex flex-wrap gap-2">
          <a
            v-for="pdf in sermon.pdfFiles"
            :key="`${pdf.type}-${pdf.url}`"
            :href="pdf.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group/pdf inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20"
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
        <p v-else class="text-xs text-muted-foreground/70">
          No documents attached
        </p>
      </div>
    </div>
  </article>
</template>
