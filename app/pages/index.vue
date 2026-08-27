<script setup lang="ts">
import CGatheringSection from "~/components/common/CGatheringSection.vue";
import AboutUs from "~/components/home/AboutUs.vue";
import ContactSection from "~/components/home/ContactSection/ContactSection.vue";
import Daily from "~/components/home/Daily/Daily.vue";
import EventSection from "~/components/home/EventSection/EventSection.vue";
import GallerySection from "~/components/home/GallerySection.vue";
import GenerositySection from "~/components/home/GenerositySection.vue";
import GospelSection from "~/components/home/GospelSection.vue";
import HeroSection from "~/components/home/HeroSection.vue";
import MinistrySection from "~/components/home/MinistrySection/MinistrySection.vue";
import SermonsSection from "~/components/home/SermonsSection/SermonsSection.vue";
import WelcomeSection from "~/components/home/WelcomeSection.vue";
</script>

<template>
  <div>
    <HeroSection />
    <Daily />
    <AboutUs />
    <GospelSection />
    <WelcomeSection />
    <CGatheringSection
      reference="Matthew 18:20"
      text="For where two or three gather in my name, there am I with them."
    />
    <SermonsSection />
    <EventSection />
    <MinistrySection />
    <GallerySection />
    <GenerositySection />
    <ContactSection />
  </div>
</template>
