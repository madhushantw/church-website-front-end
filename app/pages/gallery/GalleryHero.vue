<script setup lang="ts">
import { computed } from "vue";

import { CPageHero } from "~/components/common"
import { useChurchHeroImage } from "~/composables/useChurchHeroImage";

const { churchInfoStore, canEdit, isSaving, error, saveImage } = useChurchHeroImage("galleryHeroImage");
const heroImage = computed(() => churchInfoStore.churchInfo?.galleryHeroImage || "");
</script>

<template>
  <CPageHero
    :image="heroImage"
    :can-edit-image="canEdit"
    :image-loading="churchInfoStore.isLoading || isSaving"
    :image-saving="isSaving"
    :image-save-error="error"
    alt="Church worship gathering"
    label="Our Community"
    title="Moments of Faith"
    highlighted="& Fellowship"
    description="Take a glimpse into the life of our church family. Explore moments of worship, community, service, and celebration."
    @save-image="saveImage"
  />
</template>