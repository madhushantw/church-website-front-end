<script setup lang="ts">
import { SermonsService, type SermonItem } from "~/services/sermons.service";
import { CBiblePassageCard, CSection, CSectionHeading } from "../common";

const gospel = ref<SermonItem | null>(null);

onMounted(async () => {
  const response = await SermonsService.getGospel();
  gospel.value = response.data;
  console.log(gospel);
});
</script>

<template>
  <CSection id="gospel" background-color="muted">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
      <div class="lg:col-span-2 flex flex-col">
        <CSectionHeading
          label="This Sunday"
          title="Sunday Gospel"
          highlighted="Reading"
        />
        <div class="flex flex-col gap-8">
          <p class="text-muted-foreground text-[14px] leading-relaxed">
            Each week we reflect on the Gospel proclaimed at Mass. Read,
            meditate, and come prepared to encounter Christ in the Word.
          </p>

          <div
            class="flex flex-col gap-4 rounded-lg border border-primary/20 bg-primary/10 p-5"
          >
            <div class="flex gap-2">
              <UIcon name="uil:calendar" class="mt-1 text-primary" />
              <div v-if="gospel" class="flex flex-col gap-2 text-primary">
                {{ formatDate(gospel.sermonDate, "MMM D, YYYY") }}
                <div class="text-[12px] uppercase text-muted-foreground">
                  {{ gospel?.title }}
                </div>
              </div>
            </div>
            <div class="h-px w-full bg-primary/15" />
            <div class="flex flex-col gap-2">
              <div class="text-[13px] font-medium text-foreground">
                Priest's Reflection
              </div>
              <div
                class="font-['Playfair_Display'] text-[17px] font-semibold text-primary"
              >
                {{ gospel?.preacher }}
              </div>
            </div>
          </div>
          <div class="flex gap-4 items-center">
            <div
              class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <UIcon name="mynaui:book" :size="24" class="text-primary" />
            </div>
            <div>
              <div class="text-foreground font-medium text-[14px]">
                Lectionary Year C
              </div>
              <div class="text-muted-foreground text-[12px]">
                Updated every Sunday
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-3">
        <CBiblePassageCard
          v-if="gospel"
          book="Saint Luke"
          :reference="gospel.title"
          :passage="gospel.description || ''"
          :reflection="gospel.reflection || ''"
          :author="gospel.preacher"
        />
      </div>
    </div>
  </CSection>
</template>
