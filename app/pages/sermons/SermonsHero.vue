<script setup lang="ts">
import { computed } from "vue";

import { CPageHero } from "~/components/common"
import { useChurchHeroImage } from "~/composables/useChurchHeroImage";

const { churchInfoStore, canEdit, isSaving, error, saveImage } = useChurchHeroImage("sermonsHeroImage");
const heroImage = computed(() => churchInfoStore.churchInfo?.sermonsHeroImage || "");
</script>

<template>
  <CPageHero
    :image="heroImage"
    :can-edit-image="canEdit"
    :image-loading="churchInfoStore.isLoading || isSaving"
    :image-saving="isSaving"
    :image-save-error="error"
    alt="Church sermon and worship"
    label="Messages"
    title="Words That"
    highlighted="Inspire"
    description="Discover messages of faith, hope, and grace. Listen to sermons that encourage you to grow deeper in your relationship with God."
    @save-image="saveImage"
  />
</template>