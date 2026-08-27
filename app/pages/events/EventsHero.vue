<script setup lang="ts">
import { CPageHero } from "~/components/common"
</script>

<template>
  <CPageHero
    image="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1800&h=900&fit=crop&auto=format"
    alt="Church community gathering"
    label="Gather With Us"
    title="Life Is Better"
    highlighted="Together"
    description="From worship and fellowship to serving our community, discover what's happening at our church and find your place to connect."
    :buttons="[
      {
        title: 'View Events',
        color: 'accent',
        appendIcon: 'lucide:arrow-down',
      },
      {
        title: 'Plan Your Visit',
        color: 'accent',
        outlined: true,
      },
    ]"
  />
</template>