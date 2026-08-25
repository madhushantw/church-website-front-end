<script setup lang="ts">
import { CButton, CSection, CSectionHeading } from "../common";
</script>

<template>
  <CSection id="about">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div class="relative group">
        <div
          class="relative rounded-xl overflow-hidden shadow-2xl bg-foreground aspect-video"
        >
          <img
            src="https://images.unsplash.com/photo-1570786032462-2efc3ca8fccd?w=900&amp;h=506&amp;fit=crop&amp;auto=format"
            alt="Parish Priest video message"
            class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          >
          <div
            class="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/20 transition-colors"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="w-20 h-20 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <UIcon name="line-md:play-filled" size="44" class="text-primary" />
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-foreground/70 to-transparent"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span
                class="text-white text-[12px] font-medium tracking-wide uppercase"
                >Latest Message</span
              >
            </div>
            <div
              class="text-white font-semibold text-[16px] mt-1 font-['Playfair_Display']"
            >
              A Word of Welcome from Our Pastor
            </div>
          </div>
        </div>
        <div
          class="absolute -bottom-4 -right-4 w-20 h-20 border-2 border-accent/40 rounded-xl -z-10"
        />
      </div>
      <div class="lg:pl-4">
        <CSectionHeading
          label="A Message From Our Pastor"
          title="Welcome to"
          highlighted="Grace Community"
          header-class="lg:text-6xl"
        />
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 rounded-full overflow-hidden bg-secondary border-2 border-primary/20 shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&amp;h=100&amp;fit=crop&amp;auto=format&amp;face=1"
              alt="Fr. James Callahan"
              class="w-full h-full object-cover"
            >
          </div>
          <div>
            <div class="text-foreground font-semibold text-[15px]">
              Fr. James Callahan
            </div>
            <div class="text-muted-foreground text-[13px]">
              Parish Priest, Grace Community Church
            </div>
            <div class="text-primary text-[12px] font-medium mt-0.5">
              Pastor since 2012
            </div>
          </div>
        </div>
        <blockquote class="border-l-4 border-primary/30 pl-5 mb-6">
          <p
            class="text-foreground/75 text-[18px] leading-relaxed italic font-['Playfair_Display']"
          >
            "Whether you are joining us for the first time or have been part of
            this family for years, know that you are seen, you are loved, and
            you belong here. Grace Community is not just a church — it is a
            home."
          </p>
        </blockquote>
        <p class="text-foreground/65 text-[15px] leading-relaxed mb-8">
          Each week I record a short video message to connect with our
          parishioners and especially to welcome those visiting for the first
          time. I invite you to watch, pray with us, and come and experience the
          warmth of our community in person.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <CButton
            title="Watch Full Message"
            prepend-icon="material-symbols:mic-outline"
          />
          <CButton title="Browse All Sermons" outlined />
        </div>
      </div>
    </div>
  </CSection>
</template>
