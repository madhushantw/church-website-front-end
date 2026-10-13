<script setup lang="ts">
import appIcon from "../../../public/favIcon.png";

defineProps<Props>();

const isExpanded = ref(false);

interface Props {
  book: string;
  reference: string;
  passage: string;
  reflection?: string;
  author?: string;
}
</script>

<template>
  <article
    class="group relative isolate overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/10"
  >
    <header
      class="relative overflow-hidden bg-linear-to-br from-primary via-primary to-primary/80 px-6 py-6 text-white sm:px-8 sm:py-7"
    >
      <UIcon
        name="lucide:book-open"
        class="pointer-events-none absolute -bottom-6 right-16 size-32 -rotate-12 text-white/10 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110"
      />
      <div
        class="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-16 right-0 h-44 w-44 rounded-full bg-black/10 blur-3xl"
      />

      <div class="relative flex items-center justify-between gap-5">
        <div class="min-w-0">
          <p
            class="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/75"
          >
            <span class="h-px w-6 shrink-0 bg-white/50" />
            Holy Gospel According to {{ book }}
          </p>

          <h2
            class="font-['Playfair_Display'] text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
          >
            {{ reference }}
          </h2>
        </div>

        <div
          class="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 p-2 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 sm:size-16"
        >
          <img class="size-full object-contain" :src="appIcon" alt="" >
        </div>
      </div>
    </header>

    <div class="px-6 py-7 sm:px-8 sm:py-8">
      <div class="relative">
        <UIcon
          name="lucide:quote"
          class="pointer-events-none absolute -left-1 -top-2 size-12 text-primary/10"
        />

        <div
          class="relative overflow-auto pl-1 pt-6 transition-all duration-500"
          :class="isExpanded ? 'max-h-250' : 'max-h-60'"
        >
          <p
            class="whitespace-pre-line text-[19px] leading-8 text-foreground/85"
          >
            {{ passage }}
          </p>

          <div
            v-if="!isExpanded"
            class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white via-white/90 to-transparent"
          />
        </div>
      </div>

      <button
        type="button"
        :aria-expanded="isExpanded"
        class="group/btn mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[13px] font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? "Show less" : "Read full passage" }}
        <UIcon
          name="lucide:chevron-down"
          size="15"
          class="transition-transform duration-300"
          :class="isExpanded ? 'rotate-180' : ''"
        />
      </button>

      <div
        v-if="reflection || author"
        class="relative mt-8 overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-br from-primary/5 via-secondary/40 to-transparent p-5 sm:p-6"
      >
        <span
          class="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent to-accent/30"
        />

        <p
          class="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary"
        >
          <UIcon name="lucide:pen-line" size="13" />
          Reflection
        </p>

        <p
          v-if="reflection"
          class="whitespace-pre-line text-sm leading-7 text-foreground/75"
        >
          {{ reflection }}
        </p>

        <p
          v-if="author"
          class="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <span class="h-px w-5 bg-primary/40" />
          {{ author }}
        </p>
      </div>
    </div>
  </article>
</template>
