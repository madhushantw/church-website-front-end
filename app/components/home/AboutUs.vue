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
            title="A Christian Church"
            highlighted="and Anglican"
            header-class="lg:text-6xl"
          />
          <div
            class="mb-8 space-y-5 text-[16px] leading-relaxed text-foreground/70"
          >
            <p>
              Above all we are a Christian Church and we are also an
              <a href="https://www.stlukesmodbury.com/christianity" class="underline decoration-accent underline-offset-4 hover:text-accent">Anglican</a>
              Church. What does it mean to be Anglican? How do we differ from other Churches?
            </p>
          </div>
          <ul class="mb-8 space-y-3 text-[16px] leading-relaxed text-foreground/70">
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We are in a Communion of over 70 million people, spread all over the world.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We see ourselves as both Catholic and Reformed.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We base what we believe on Scripture – but have a very high regard for both Tradition and Reason.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We are an Episcopal Church – led by bishops.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We are a sacramental church.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We hold to the teachings of the early Councils of the Church, and the beliefs expressed in the Creeds.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We are not the church – we are part of the Universal Church.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We have our origins in the Church of England – but all parts of the Anglican Church are autonomous.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>
                We hold the
                <a href="http://goo.gl/tannd" class="underline decoration-accent underline-offset-4 hover:text-accent">Archbishop of Canterbury</a>
                in high esteem – but she is the first among equals.
              </span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent"/>
              <span>We do not think that we know the right way – but we are willing to look for it!</span>
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