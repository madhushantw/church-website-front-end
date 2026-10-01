<script setup lang="ts">
import priestImage from "~/assets/images/priest-avatar.png";
import { CButton, CSection, CSectionHeading } from "../common";

const exampleVideoUrl = "https://www.youtube-nocookie.com/embed/Xmq53wlfMek";
</script>

<template>
  <CSection id="about">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div class="relative group">
        <div
          class="relative rounded-xl overflow-hidden shadow-2xl bg-foreground aspect-video"
        >
          <iframe
            :src="exampleVideoUrl"
            title="Example welcome video from St Luke's Anglican Church"
            class="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </div>
        <div
          class="absolute -bottom-4 -right-4 w-20 h-20 border-2 border-accent/40 rounded-xl -z-10"
        />
      </div>
      <div class="lg:pl-4">
        <CSectionHeading
          label="A Message From Our Pastor"
          title="Welcome to"
          highlighted="St Luke's"
          header-class="lg:text-6xl"
        />
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 rounded-full overflow-hidden bg-secondary border-2 border-primary/20 shrink-0"
          >
            <img
              :src="priestImage"
              alt="The Venerable Jo Smith "
              class="w-full h-full object-cover"
            >
          </div>
          <div>
            <div class="text-foreground font-semibold text-[15px]">
              The Venerable Jo Smith
            </div>
            <div class="text-muted-foreground text-[13px]">
              Parish Priest, St Luke's Anglican Church
            </div>
            <div class="text-primary text-[12px] font-medium mt-0.5">
              Rev’d Samuel Yengi
            </div>
          </div>
        </div>
        <blockquote class="border-l-4 border-primary/30 pl-5 mb-6">
          <p
            class="text-foreground/75 text-[18px] leading-relaxed italic font-['Playfair_Display']"
          >
            "We are so pleased you have joined us today and hope that we can
            provide what you are looking for in your spiritual life."
          </p>
        </blockquote>
        <p class="text-foreground/65 text-[15px] leading-relaxed mb-8">
          After every service we gather and share refreshments and a time of
          fellowship. We warmly invite you to join us.
          <br>
          A good way to get to know
          each other is to join in group activities and we have much to offer in
          this regard.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <CButton
            title="Watch Full Message"
            prepend-icon="material-symbols:mic-outline"
          />
        </div>
      </div>
    </div>
  </CSection>
</template>
