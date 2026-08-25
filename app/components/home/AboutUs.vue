<script setup lang="ts">
import { CSection, CSectionHeading, CStat } from "../common";
import CButton from "../common/CButton.vue";

const stats = [
  {
    value: "1,200+",
    label: "Members",
  },
  {
    value: "35+",
    label: "Small Groups",
  },
  {
    value: "12",
    label: "Ministries",
  },
  {
    value: "6",
    label: "Mission Partners",
  },
];
</script>

<template>
  <CSection id="about">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="grid items-center gap-16 lg:grid-cols-2">
        <div class="relative">
          <div class="relative overflow-hidden rounded-lg shadow-xl">
            <img
              src="https://adjust-shock-58675515.figma.site/_components/v2/4cf6a4066e32f17a0d7652028d932a3bd8306b4f/image.29153409.png"
              alt="Grace Community Church building"
              class="h-115 w-full object-cover"
            >
          </div>
          <div
            class="absolute -bottom-6 -right-6 hidden rounded-lg bg-accent px-7 py-5 text-white shadow-lg md:block"
          >
            <div class="font-['Playfair_Display'] text-5xl leading-none">
              40+
            </div>
            <div class="mt-1 text-[13px] text-white/80">Years of Ministry</div>
          </div>
        </div>

        <div class="lg:pl-4">
          <CSectionHeading
            label="Our Story"
            title="A Community Rooted"
            highlighted="in Faith"
            header-class="lg:text-6xl"
          />
          <div
            class="mb-8 space-y-5 text-[16px] leading-relaxed text-foreground/70"
          >
            <p>
              Founded in 1983, Grace Community Church has been a cornerstone of
              this neighborhood for over four decades. We are a diverse,
              welcoming congregation united by our love for God and one another
              — committed to worship, Scripture-grounded teaching, and community
              service.
            </p>
            <p>
              Whether you're seeking answers, returning to faith, or looking for
              a spiritual home, our doors are always open.
            </p>
          </div>
          <div class="mb-8 grid grid-cols-2 gap-6">
            <CStat v-for="stat in stats" :key="stat.label" v-bind="stat" />
          </div>
          <div class="flex">
            <CButton title="Plan Your Visit" append-icon="ep:right" />
          </div>
        </div>
      </div>
    </div>
  </CSection>
</template>
