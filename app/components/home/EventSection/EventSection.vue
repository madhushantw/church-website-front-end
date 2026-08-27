<script setup lang="ts">
import { CSection, CSectionHeading } from '~/components/common'
import EventCard from './EventCard.vue'


interface Event {
  title: string
  subTitle: string
  date: Date
  time: string
  location: string
}

const events: Event[] = [
  {
    title: 'Family Picnic & Fellowship',
    subTitle:
      'Join us for an afternoon of food, games, and community. All families welcome.',
    date: new Date(2026, 6, 12),
    time: '2:00 PM',
    location: 'Church Grounds',
  },
  {
    title: 'Sunday Morning Worship',
    subTitle:
      'Come together as a church family for worship, prayer, and fellowship.',
    date: new Date(2026, 6, 19),
    time: '9:00 AM',
    location: 'Main Sanctuary',
  },
  {
    title: 'Youth Fellowship',
    subTitle:
      'An evening of fellowship, worship, and activities for our young people.',
    date: new Date(2026, 6, 25),
    time: '6:30 PM',
    location: 'Youth Hall',
  },
]
</script>

<template>
  <CSection id="events" background-color="muted">
    <CSectionHeading
      label="Calendar"
      title="Upcoming Events"
    />

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <EventCard
        v-for="event in events"
        :key="event.date.getTime() + event.title"
        :event="event"
      />
    </div>
  </CSection>
</template>