<script setup lang="ts">
interface Ministry {
  title: string;
  image?: string;
  subtitle: string;
  icon?: string;
  iconColor?: string;
}

interface Props {
  ministry: Ministry;
}

defineProps<Props>();
</script>

<template>
  <div
    class="group cursor-pointer rounded-lg border border-primary/10 bg-white p-7 transition-all hover:border-primary/30 hover:shadow-md"
  >
    <div
      class="mb-5 flex h-14 w-14 items-center justify-center rounded-lg transition-colors"
      :style="{
        backgroundColor: `color-mix(in srgb, var(--color-${ministry.iconColor || 'primary'}) 10%, transparent)`,
      }"
    >
      <UIcon
        :name="ministry.icon || 'lucide:church'"
        size="26"
        :style="{
          color: `var(--color-${ministry.iconColor || 'primary'})`,
        }"
      />
    </div>

    <h3
      class="mb-3 font-['Playfair_Display'] text-[18px] font-medium text-foreground transition-colors group-hover:text-primary"
    >
      {{ ministry.title }}
    </h3>

    <p class="text-[14px] leading-relaxed text-muted-foreground">
      {{ ministry.subtitle }}
    </p>

    <div
      class="mt-4 flex items-center gap-1 text-[13px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
    >
      Learn more

      <UIcon
        name="lucide:arrow-right"
        size="15"
        class="transition-transform group-hover:translate-x-1"
      />
    </div>
  </div>
</template>
