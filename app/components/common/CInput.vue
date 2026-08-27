<script setup lang="ts">
interface Props {
  label?: string
  placeholder?: string
  textarea?: boolean
}

defineProps<Props>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div>
    <label
      v-if="label"
      class="mb-1.5 block text-[13px] font-medium text-foreground/70"
    >
      {{ label }}
    </label>

    <UTextarea
      v-if="textarea"
      v-model="model"
      :placeholder="placeholder"
      :rows="5"
      size="xl"
      variant="soft"
      class="w-full [&_textarea]:border [&_textarea]:border-primary/20"
    />

    <UInput
      v-else
      v-model="model"
      :placeholder="placeholder"
      size="xl"
      variant="soft"
      class="w-full [&_input]:h-12 [&_input]:border [&_input]:border-primary/20"
    />
  </div>
</template>