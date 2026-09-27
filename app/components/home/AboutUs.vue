<script setup lang="ts">
import { CSection, CSectionHeading, CStat } from "../common";
import CButton from "../common/CButton.vue";

const stats = [
  {
    value: "70M+",
    label: "Communion Members Worldwide",
  },
  {
    value: "1983",
    label: "Founded",
  },
  {
    value: "70+",
    label: "Years in Communion",
  },
  {
    value: "12",
    label: "Ministries",
  },
];
</script>

<template>
  <CSection id="about">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="grid gap-16 lg:grid-cols-2">
        <div class="relative">
          <div class="relative">
            <img
              src="https://adjust-shock-58675515.figma.site/_components/v2/4cf6a4066e32f17a0d7652028d932a3bd8306b4f/image.29153409.png"
              alt="St Luke's Modbury Church building"
              class="h-115 w-full object-cover rounded-lg shadow-xl"
            >
            <div
              class="absolute -bottom-6 -right-6 hidden rounded-lg bg-accent px-7 py-5 text-white shadow-xl md:block"
            >
              <div class="font-['Playfair_Display'] text-5xl leading-none">
                70M+
              </div>
              <div class="mt-1 text-[13px] text-white/80">In Communion Worldwide</div>
            </div>
          </div>
        </div>

        <div class="lg:pl-4">
          <CSectionHeading
            label="About Us"
            title="External Mission"
            highlighted="Support Activities "
            header-class="lg:text-6xl"
          />
          <ul class="mb-8 space-y-3 text-[16px] leading-relaxed text-foreground/70">
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Quickest Warmth – supplying useful new items on request by an organisation for their clients</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>School Ministry – supporting chaplains in our local schools.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Foster Homes in Africa.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Anglican Board of Mission.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Anglicare.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Samaritans Purse Christmas Shoe Boxes – Christmas gifts for children.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Food Bank.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Bush Church Aid (BCA)</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Church Missionary Society (CMS)</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>Food Hampers through the OP Shop.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We have as many failings as everyone else!</span>
            </li>
          </ul>
          <p class="mb-8 text-[16px] leading-relaxed text-foreground/70">
            We try to welcome everyone.
          </p>
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