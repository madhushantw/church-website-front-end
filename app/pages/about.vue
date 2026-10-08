<script setup lang="ts">
import AboutUs from "~/components/home/AboutUs.vue";
import OurTeam from "~/components/home/OurTeam.vue";
import { CPageHero } from "~/components/common";
import NextStep from "~/components/home/NextStep.vue";
</script>

<template>
  <div>
    <CPageHero
      image="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1800&h=900&fit=crop&auto=format"
      alt="about us"
      label=""
      title=""
      highlighted="About Us"
      description="At St Luke's Anglican Church we believe that belonging is just the beginning to a life of significance and purpose. Our community and our teachings are built around connecting people to each other and to God."
    />
    <AboutUs allow-create />
    <NextStep />
    <OurTeam />
  </div>
</template>
