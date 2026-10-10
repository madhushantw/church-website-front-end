<script setup lang="ts">
import { ref } from "vue";
import type { MinistryItem } from "~/services/ministries.service";

interface Props {
  ministry: MinistryItem;
  canDelete?: boolean;
  canEdit?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  delete: [ministry: MinistryItem];
  edit: [ministry: MinistryItem];
}>();
const expanded = ref(false);

const ministryIcons: Record<MinistryItem["type"], string> = {
  general: "lucide:church",
  children: "lucide:baby",
  youth: "lucide:users",
  women: "lucide:heart",
  men: "lucide:user-round",
  worship: "lucide:music",
  outreach: "lucide:hand-heart",
  prayer: "lucide:hand-heart",
  media: "lucide:video",
};
</script>

<template>
  <article
    class="group relative isolate flex min-h-88 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/10 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
  >
    
    <div class="absolute inset-0 -z-20 bg-primary/30">
      <img
        v-if="ministry.image"
        :src="ministry.image"
        :alt="ministry.name"
        loading="lazy"
        class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
      >
    </div>
    <div
      class="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/45 to-black/10 transition-opacity duration-500"
    />
    <div
      class="absolute inset-0 -z-10 bg-primary/10 mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    />

    <div class="flex items-start justify-between gap-3 p-5">
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
      >
        <UIcon
          :name="ministryIcons[ministry.type]"
          size="26"
          class="text-white drop-shadow"
        />
      </div>

      <div
        v-if="props.canEdit || props.canDelete"
        class="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 p-1 opacity-100 backdrop-blur-md transition-all duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
      >
        <UButton
          v-if="props.canEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Edit ministry"
          class="rounded-full text-white hover:bg-white/20"
          @click.stop="emit('edit', ministry)"
        />
        <UButton
          v-if="props.canDelete"
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="xs"
          aria-label="Delete ministry"
          class="rounded-full text-red-300 hover:bg-red-500/30"
          @click.stop="emit('delete', ministry)"
        />
      </div>
    </div>

    <div class="p-3">
      <div
        class="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition-colors duration-300 group-hover:bg-white/15"
      >
        <span
          class="mb-3 block h-1 w-10 rounded-full bg-primary transition-all duration-500 group-hover:w-20"
        />

        <h3
          class="mb-2 font-['Playfair_Display'] text-xl font-semibold tracking-tight text-white"
        >
          {{ ministry.name }}
        </h3>

        <p
          class="text-sm leading-relaxed text-white/80"
          :class="expanded ? '' : 'line-clamp-2'"
        >
          {{ ministry.description }}
        </p>

        <button
          type="button"
          class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white transition-all hover:bg-white hover:text-gray-900"
          @click.stop="expanded = !expanded"
        >
          {{ expanded ? "Show less" : "Show more" }}
          <UIcon
            name="lucide:chevron-down"
            size="14"
            class="transition-transform duration-300"
            :class="expanded ? 'rotate-180' : ''"
          />
        </button>
      </div>
    </div>
  </article>
</template>
