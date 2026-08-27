<script setup lang="ts">
import { CSection, CSectionHeading } from '../../common'
import MinistryCard from './MinistryCard.vue'

interface Ministry {
  title: string
  subtitle: string
  icon?: string
  iconColor?: string
}

const ministries: Ministry[] = [
  {
    title: 'Children & Youth',
    subtitle:
      'Nurturing the next generation in faith, friendship, and purpose. Programs for ages 3–18 every Sunday and Wednesday.',
    icon: 'lucide:users',
    iconColor: 'primary',
  },
  {
    title: 'Care & Counseling',
    subtitle:
      'Pastoral care, grief support, and confidential counseling for individuals and families in every season of life.',
    icon: 'lucide:heart-handshake',
    iconColor: 'accent',
  },
  {
    title: 'Bible Study Groups',
    subtitle:
      'Small groups meeting weekly to explore scripture, grow in knowledge, and build lasting friendships.',
    icon: 'lucide:book-open',
    iconColor: 'primary',
  },
  {
    title: 'Worship & Arts',
    subtitle:
      'Express your gifts through choir, contemporary worship band, drama, and visual arts ministries.',
    icon: 'lucide:music',
    iconColor: 'primary',
  },
  {
    title: 'Community Outreach',
    subtitle:
      'Serving our city through food drives, neighborhood clean-ups, and partnerships with local nonprofits.',
    icon: 'lucide:hand-heart',
    iconColor: 'accent',
  },
  {
    title: 'Missions',
    subtitle:
      'Supporting missionaries locally and globally through prayer, giving, and service trips.',
    icon: 'lucide:globe',
    iconColor: 'primary',
  },
]
</script>

<template>
  <CSection id="ministries" background-color="muted">
    <CSectionHeading
      label="Ministries"
      title="Growing Together in Faith"
      sub-title="Find where your gifts, passions, and calling intersect with the life of our church."
      centered
    />

    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <MinistryCard
        v-for="ministry in ministries"
        :key="ministry.title"
        :ministry="ministry"
      />
    </div>
  </CSection>
</template>