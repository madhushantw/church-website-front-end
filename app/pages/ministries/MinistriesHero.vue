<script setup lang="ts">
import { computed } from "vue";

import { CPageHero } from "~/components/common"
import { useChurchHeroImage } from "~/composables/useChurchHeroImage";

const { churchInfoStore, canEdit, isSaving, error, saveImage } = useChurchHeroImage("ministryHeroImage");
const heroImage = computed(() => churchInfoStore.churchInfo?.ministryHeroImage || "");
</script>

<template>
  <CPageHero
    :image="heroImage"
    :can-edit-image="canEdit"
    :image-loading="churchInfoStore.isLoading || isSaving"
    :image-saving="isSaving"
    :image-save-error="error"
    alt="Church community serving together"
    label="Find Your Place"
    title="Growing Together in"
    highlighted="Faith"
    description="Discover the ministries, people, and opportunities that help you connect, serve, and grow in the life of our church."
    @save-image="saveImage"
  />
</template>