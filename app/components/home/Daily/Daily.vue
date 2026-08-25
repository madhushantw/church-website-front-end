<script setup lang="ts">
import DailyCard from "./DailyCard.vue";
const dailyItems = [
  { title: 'Morning Worship', day: 'Sunday', time: '9:00 AM', place: 'Main Sanctuary' },
  { title: 'Contemporary Service', day: 'Sunday', time: '9:00 AM', place: 'Main Sanctuary' },
  { title: 'Midweek Prayer', day: 'Sunday', time: '9:00 AM', place: 'Main Sanctuary' },
]
</script>

<template>
  <section class="bg-primary py-0">
    <UContainer class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
      <DailyCard
        v-for="(item, index) in dailyItems"
        :key="index"
        v-bind="item"
      />
    </UContainer>
  </section>
</template>
