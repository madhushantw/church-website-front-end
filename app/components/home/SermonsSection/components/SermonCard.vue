<script setup lang="ts">
interface Props {
  title: string;
  image: string;
  scripture: string;
  date: string;
  preacher: string;
  duration?: string;
}

withDefaults(defineProps<Props>(), {
  duration: "00 min",
});
</script>

<template>
  <article
    class="group cursor-pointer overflow-hidden rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="relative overflow-hidden">
      <img
        :src="image"
        :alt="title"
        class="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
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
      <div
        class="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm"
      >
        {{ duration }}
      </div>
    </div>
    <div class="p-6">
      <div class="mb-3 flex items-center justify-between gap-4">
        <span
          class="text-[11px] font-medium uppercase tracking-widest text-accent"
        >
          {{ scripture }}
        </span>

        <span class="whitespace-nowrap text-[12px] text-muted-foreground">
          {{ date }}
        </span>
      </div>

      <h3
        class="mb-2 font-['Playfair_Display'] text-[18px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary"
      >
        {{ title }}
      </h3>

      <p class="text-[13px] text-muted-foreground">
        {{ preacher }}
      </p>
    </div>
  </article>
</template>
