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
        v-for="(step, index) in nextSteps"
        :key="step.title"
        :to="step.href"
        class="group relative isolate flex min-h-104 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/10 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/25"
        @click="handleCardClick($event, step.action)"
      >
        <!-- Background image -->
        <img
          :src="step.image"
          :alt="step.imageAlt"
          loading="lazy"
          class="absolute inset-0 -z-20 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        >

        <!-- Overlays -->
        <div
          class="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/40 to-black/10"
        />
        <div
          class="absolute inset-0 -z-10 bg-primary/20 opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-100"
        />

        <!-- Top row: icon + step number -->
        <div class="flex items-start justify-between p-5">
          <div
            class="flex size-14 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
          >
            <UIcon :name="step.icon" class="size-6" />
          </div>

          <span
            class="font-['Playfair_Display'] text-5xl font-bold leading-none text-white/20 transition-colors duration-500 group-hover:text-white/50"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
        </div>

        <!-- Glass content panel -->
        <div class="p-3">
          <div
            class="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 group-hover:bg-white/15"
          >
            <span
              class="mb-4 block h-1 w-10 rounded-full bg-primary transition-all duration-500 group-hover:w-20"
            />

            <h3
              class="mb-2 font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-white"
            >
              {{ step.title }}
            </h3>

            <p class="text-sm leading-relaxed text-white/80">
              {{ step.description }}
            </p>

            <span
              v-if="step.action"
              class="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-gray-900"
            >
              {{ step.action }}
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <PrayerRequestDialog v-model:open="isPrayerDialogOpen" />
  </CSection>
</template>
