<script setup lang="ts">
import createDOMPurify from "dompurify";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  html: string;
}>();

const root = ref<HTMLElement | null>(null);

const renderHtml = () => {
  if (!root.value) return;

  const safeHtml = typeof window === "undefined"
    ? props.html
    : createDOMPurify(window).sanitize(props.html || "");

  root.value.innerHTML = safeHtml;
};

watch(() => props.html, renderHtml, { immediate: true });
onMounted(renderHtml);
</script>

<template>
  <div ref="root" />
</template>
