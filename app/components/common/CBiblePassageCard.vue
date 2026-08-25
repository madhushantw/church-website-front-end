<script setup lang="ts">
defineProps<Props>();

const isExpanded = ref(false);

const previewLength = 300;
interface Props {
  book: string;
  reference: string;
  passage: string;
  reflection: string;
  author: string;
}
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
  >
    <div class="bg-primary px-7 py-5 text-white">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p
            class="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/70"
          >
            Holy Gospel of Jesus Christ According to {{ book }}
          </p>

          <h2 class="font-serif text-xl font-bold">
            {{ reference }}
          </h2>
        </div>

        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-3xl text-white"
        >
          †
        </div>
      </div>
    </div>

    <div class="px-7 py-7">
      <div
        class="relative overflow-hidden transition-all duration-500"
        :class="isExpanded ? 'max-h-250' : 'max-h-42'"
      >
        <p
          class="whitespace-pre-line text-[19px] italic font-['Playfair_Display'] leading-7 text-foreground/80"
        >
          {{ passage }}
        </p>
        <div
          v-if="!isExpanded"
          class="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white via-white/90 to-transparent"
        />
      </div>

      <button
        v-if="passage.length > previewLength"
        type="button"
        class="mt-5 flex items-center gap-1 text-sm font-[13px] text-primary hover:text-primary/60"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? "Show less" : "Read full passage" }}
        <UIcon
          :name="
            isExpanded ? 'icon-park-outline:down' : 'icon-park-outline:right'
          "
        />
      </button>

      <div
        class="mt-7 rounded-r-xl border-l-4 border-accent bg-secondary/50 px-5 py-5"
      >
        <p
          class="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent"
        >
          Priest's Reflection
        </p>

        <p class="whitespace-pre-line text-sm leading-6 text-gray-600">
          {{ reflection }}
        </p>

        <p class="mt-4 text-xs font-medium text-gray-500">— {{ author }}</p>
      </div>
    </div>
  </div>
</template>
