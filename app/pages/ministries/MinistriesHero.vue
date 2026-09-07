<script setup lang="ts">
import { CPageHero } from "~/components/common"
</script>

<template>
  <CPageHero
    image="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1800&h=900&fit=crop&auto=format"
    alt="Church community serving together"
    label="Find Your Place"
    title="Growing Together in"
    highlighted="Faith"
    description="Discover the ministries, people, and opportunities that help you connect, serve, and grow in the life of our church."
    :buttons="[
      {
        title: 'Explore Ministries',
        color: 'accent',
        appendIcon: 'lucide:arrow-down',
      },
    ]"
  />
</template>