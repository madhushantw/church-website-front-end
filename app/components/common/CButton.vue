<script setup lang="ts">
import { capitalize, computed } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  outlined: false,
  compact: false,
  color: 'primary',
  title: undefined,
  prependIcon: undefined,
  appendIcon: undefined,
})

const emit = defineEmits<{
  onClick: []
}>()

const styles = computed(() => {
  const color = `--ui-${props.color}`

  return {
    height: props.compact ? '40px' : '56px',
		fontSize: props.compact ? '11px' : '15px',
    border: props.outlined ? `1px solid var(${color})` : 'none',
    background: props.outlined ? 'transparent' : `var(${color})`,
    color: props.outlined ? `var(${color})` : 'var(--ui-neutral)',
  }
})

interface Props {
  outlined?: boolean
  compact?: boolean
  color?: string
  title?: string
  prependIcon?: string
  appendIcon?: string
}
</script>

<template>
  <div
    class="button-wrapper px-4"
    :style="styles"
    @click="emit('onClick')"
  >
    <UIcon
      v-if="prependIcon"
      :name="prependIcon"
      :size="compact ? 18 : 20"
    />

    <template v-if="title">
      {{ capitalize(title) }}
    </template>

    <template v-else>
      <slot />
    </template>

    <UIcon
      v-if="appendIcon"
      :name="appendIcon"
      :size="compact ? 18 : 20"
    />
  </div>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
}
.button-wrapper:hover {
	opacity: 0.8;
}
</style>