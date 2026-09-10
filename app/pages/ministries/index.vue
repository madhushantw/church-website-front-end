<script setup lang="ts">
import MinistrySection from "~/components/home/MinistrySection/MinistrySection.vue"
import MinistriesHero from "./MinistriesHero.vue"
</script>

<template>
  <div>
    <MinistriesHero />
    <MinistrySection hide-navigation-button allow-create />
  </div>
</template>