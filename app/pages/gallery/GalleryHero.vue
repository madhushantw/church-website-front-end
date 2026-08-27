<script setup lang="ts">
import { CPageHero } from "~/components/common"
</script>

<template>
  <CPageHero
    image="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1800&h=900&fit=crop&auto=format"
    alt="Church worship gathering"
    label="Our Community"
    title="Moments of Faith"
    highlighted="& Fellowship"
    description="Take a glimpse into the life of our church family. Explore moments of worship, community, service, and celebration."
    :buttons="[
      {
        title: 'Explore Gallery',
        color: 'white',
        appendIcon: 'lucide:images',
      },
    ]"
  />
</template>