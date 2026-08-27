<script setup lang="ts">
import { CPageHero } from "~/components/common"
</script>

<template>
  <CPageHero
    image="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1800&h=900&fit=crop&auto=format"
    alt="Church sermon and worship"
    label="Messages"
    title="Words That"
    highlighted="Inspire"
    description="Discover messages of faith, hope, and grace. Listen to sermons that encourage you to grow deeper in your relationship with God."
    :buttons="[
      {
        title: 'Explore Sermons',
        color: 'white',
        appendIcon: 'lucide:play',
      },
    ]"
  />
</template>