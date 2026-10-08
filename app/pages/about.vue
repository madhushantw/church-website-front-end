<script setup lang="ts">
import { computed } from "vue";

import AboutUs from "~/components/home/AboutUs.vue";
import OurTeam from "~/components/home/OurTeam.vue";
import { CPageHero } from "~/components/common";
import NextStep from "~/components/home/NextStep.vue";
import { useChurchHeroImage } from "~/composables/useChurchHeroImage";

const { churchInfoStore, canEdit, isSaving, error, saveImage } = useChurchHeroImage("aboutHeroImage");
const heroImage = computed(() => churchInfoStore.churchInfo?.aboutHeroImage || "");
</script>

<template>
  <div>
    <CPageHero
      :image="heroImage"
      :can-edit-image="canEdit"
      :image-loading="churchInfoStore.isLoading || isSaving"
      :image-saving="isSaving"
      :image-save-error="error"
      alt="about us"
      label=""
      title=""
      highlighted="About Us"
      description="At St Luke's Anglican Church we believe that belonging is just the beginning to a life of significance and purpose. Our community and our teachings are built around connecting people to each other and to God."
      @save-image="saveImage"
    />
    <AboutUs allow-create />
    <NextStep />
    <OurTeam />
  </div>
</template>
