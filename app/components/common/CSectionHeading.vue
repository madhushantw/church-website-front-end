<script setup lang="ts">
interface Props {
  label: string
  title: string
  subTitle?: string
  highlighted?: string
  headerClass?: string
  centered?: boolean
}

defineProps<Props>()
</script>

<template>
  <div
    class="flex flex-col gap-4"
    :class="centered ? 'items-center text-center' : ''"
  >
    <div class="flex items-center gap-3">
      <div class="h-px w-8 bg-accent" />

      <span
        class="text-[12px] font-medium uppercase tracking-[0.22em] text-accent"
      >
        {{ label }}
      </span>

      <div v-if="centered" class="h-px w-8 bg-accent" />
    </div>
    <div class="mb-6">
      <h2
        class="font-['Playfair_Display'] text-5xl font-normal leading-tight text-foreground"
        :class="headerClass"
      >
        {{ title }}

        <span
          v-if="highlighted"
          class="italic text-primary"
        >
          {{ highlighted }}
        </span>
      </h2>

      <p
        v-if="subTitle"
        class="max-w-2xl text-[15px] leading-relaxed text-muted-foreground mb-6"
      >
        {{ subTitle }}
      </p>
    </div>
  </div>
</template>