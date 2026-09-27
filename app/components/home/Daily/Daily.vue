<script setup lang="ts">
import DailyCard from "./DailyCard.vue";

const dailyItems = [
  { title: "Holy Communion", day: "Sunday", time: "8:00 AM / 10:00 AM", place: "" },
  {
    title: "Bari Worship",
    day: "Sunday",
    time: "11:30 AM",
    place: "1st & 3rd Sunday of the month",
  },
  { title: "Holy Communion", day: "Tuesday", time: "8:30 AM", place: "" },
  { title: "Holy Communion", day: "Thursday", time: "10:00 AM", place: "" },
];
</script>

<template>
  <section class="bg-primary py-0">
    <UContainer class="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
      <DailyCard
        v-for="(item, index) in dailyItems"
        :key="index"
        v-bind="item"
      />
    </UContainer>
  </section>
</template>
