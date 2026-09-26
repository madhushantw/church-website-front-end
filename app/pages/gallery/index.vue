<script setup lang="ts">
import GallerySection from "~/components/home/GallerySection.vue";
import GalleryHero from "./GalleryHero.vue";
</script>

<template>
  <div>
    <GalleryHero />
    <GallerySection hide-navigation-button allow-create />
  </div>
</template>