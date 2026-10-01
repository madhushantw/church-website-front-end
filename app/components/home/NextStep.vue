<script setup lang="ts">
import { CSection, CSectionHeading } from "~/components/common";
import PrayerRequestDialog from "~/components/home/PrayerRequestDialog.vue";

const isPrayerDialogOpen = ref(false);

const handleCardClick = (event: MouseEvent, action: string) => {
  if (action !== "Request Prayer") return;

  event.preventDefault();
  isPrayerDialogOpen.value = true;
};

const nextSteps = [
  {
    title: "Visit Us On a Sunday",
    description:
      "Come and experience our community in person. We'd love to welcome you, meet you, and help you feel at home.",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Sunlight filling a welcoming church",
    icon: "i-lucide-church",
    action: "Plan Your Visit",
  },
  {
    title: "Talk with a Pastor",
    description:
      "Have questions about faith, life, or what it means to follow Jesus? Our pastors would love to have a conversation with you.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Friends sharing a conversation together",
    icon: "i-lucide-message-circle",
    action: "Start a Conversation",
    href: "mailto:stlukesmodbury@outlook.com",
  },
  {
    title: "Receive Prayer",
    description:
      "Whatever you're carrying, we'd be honoured to pray with you. Share your prayer request with our team and we'll stand with you in prayer.",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "A person praying in a quiet moment",
    icon: "i-lucide-heart-handshake",
    action: "Request Prayer",
  },
];
</script>

<template>
  <CSection id="next-steps" background-color="muted">
    <CSectionHeading
      label="Next Steps"
      title="Take Your Next Step"
      sub-title="Wherever you are on your journey, there’s always a next step. Whether you’d like to join us on a Sunday, chat with someone about faith, or ask for prayer, we’d love to walk alongside you."
      centered
    />

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <NuxtLink
        v-for="step in nextSteps"
        :key="step.title"
        :to="step.href"
        class="group flex h-full flex-col overflow-hidden rounded-xl border border-primary/10 bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
        @click="handleCardClick($event, step.action)"
      >
        <div class="h-48 w-full overflow-hidden">
          <img
            :src="step.image"
            :alt="step.imageAlt"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          >
        </div>
        <div class="flex flex-1 flex-col p-7">
          <div
            class="mb-6 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors"
          >
            <UIcon :name="step.icon" class="size-6" />
          </div>
          <h3 class="mb-3 font-['Playfair_Display'] text-2xl text-foreground">
            {{ step.title }}
          </h3>
          <p class="mb-7 flex-1 text-sm leading-relaxed text-muted-foreground">
            {{ step.description }}
          </p>
          <span
            v-if="step.action"
            class="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            {{ step.action }}
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </NuxtLink>
    </div>

    <PrayerRequestDialog v-model:open="isPrayerDialogOpen" />
  </CSection>
</template>
