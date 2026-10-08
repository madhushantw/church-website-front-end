<script setup lang="ts">
import { computed } from "vue";

import { CPageHero } from "~/components/common"
import { useChurchHeroImage } from "~/composables/useChurchHeroImage";

const { churchInfoStore, canEdit, isSaving, error, saveImage } = useChurchHeroImage("eventHeroImage");
const heroImage = computed(() => churchInfoStore.churchInfo?.eventHeroImage || "");
</script>

<template>
  <CPageHero
    :image="heroImage"
    :can-edit-image="canEdit"
    :image-loading="churchInfoStore.isLoading || isSaving"
    :image-saving="isSaving"
    :image-save-error="error"
    alt="Church community gathering"
    label="Gather With Us"
    title="Life Is Better"
    highlighted="Together"
    description="From worship and fellowship to serving our community, discover what's happening at our church and find your place to connect."
    @save-image="saveImage"
  />
</template>