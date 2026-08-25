<script setup lang="ts">
import { CBiblePassageCard, CSection, CSectionHeading } from "../common";

const passage =
  'As the time approached for him to be taken up to heaven, Jesus resolutely set out for Jerusalem. And he sent messengers on ahead, who went into a Samaritan village to get things ready for him; but the people there did not welcome him, because he was heading for Jerusalem. \n\nWhen the disciples James and John saw this, they asked, "Lord, do you want us to call fire down from heaven to destroy them?" But Jesus turned and rebuked them. Then he and his disciples went to another village. \n\nAs they were walking along the road, a man said to him, "I will follow you wherever you go." Jesus replied, "Foxes have dens and birds have nests, but the Son of Man has no place to lay his head." He said to another man, "Follow me." But he replied, "Lord, first let me go and bury my father." Jesus said to him, "Let the dead bury their own dead, but you go and proclaim the kingdom of God."';
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
              <div class="flex flex-col gap-2 text-primary">
                <div class="text-[13px] font-semibold">
                  Sunday, June 29, 2025
                </div>
                <div class="text-[12px] uppercase text-muted-foreground">
                  Ordinary Time — Year C
                </div>
              </div>
            </div>
            <div class="h-px w-full bg-primary/15" />
            <div class="flex flex-col gap-2">
              <div class="text-[13px] font-medium text-foreground">
                Luke 9:51–62
              </div>
              <div
                class="font-['Playfair_Display'] text-[17px] font-semibold text-primary"
              >
                The Cost of Following Jesus
              </div>
            </div>
          </div>
          <div class="flex gap-4 items-center">
            <div
              class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <UIcon name="mynaui:book" :size="24" class="text-primary"  />
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
          book="Saint Luke"
          reference="Luke 9:51–62"
          :passage
          reflection="Today's Gospel calls us to examine the cost and completeness of discipleship. Jesus does not promise comfort, but purpose. Following Him means setting our face resolutely — as He did toward Jerusalem — even when the path is uncertain. Let us reflect this week on what it means to say 'yes' without reservation."
          author="Fr. James Callahan"
        />
      </div>
    </div>
  </CSection>
</template>
