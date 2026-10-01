<script setup lang="ts">
import { CSection, CSectionHeading } from "~/components/common";
import TeamMemberDialog from "~/components/home/TeamMemberDialog.vue";
import {
  TeamMembersService,
  type TeamMember,
} from "~/services/team-members.service";
import { UserRole } from "~/services/users.service";
import { useUserStore } from "~/stores/user.store";

const userStore = useUserStore();
const teamMembers = ref<TeamMember[]>([]);
const isLoadingMembers = ref(true);
const membersError = ref("");
const isTeamMemberDialogOpen = ref(false);
const selectedMember = ref<TeamMember | null>(null);
const canManageTeam = computed(() => userStore.user?.role === UserRole.ROOT);

const loadTeamMembers = async () => {
  isLoadingMembers.value = true;
  membersError.value = "";

  try {
    const response = await TeamMembersService.getAll({ page: 1, limit: 100 });
    teamMembers.value = response.data.items;
  } catch {
    membersError.value = "Unable to load team members. Please try again.";
  } finally {
    isLoadingMembers.value = false;
  }
};

const openCreateDialog = () => {
  selectedMember.value = null;
  isTeamMemberDialogOpen.value = true;
};

const openEditDialog = (member: TeamMember) => {
  selectedMember.value = member;
  isTeamMemberDialogOpen.value = true;
};

const saveTeamMember = (member: TeamMember) => {
  const index = teamMembers.value.findIndex((item) => item.id === member.id);
  if (index === -1) teamMembers.value = [...teamMembers.value, member];
  else teamMembers.value[index] = member;
  selectedMember.value = null;
};

const removeTeamMember = (id: string) => {
  teamMembers.value = teamMembers.value.filter((member) => member.id !== id);
  selectedMember.value = null;
};

onMounted(loadTeamMembers);

const teamMembersScroller = ref<HTMLElement | null>(null);

const scrollMembers = (direction: -1 | 1) => {
  teamMembersScroller.value?.scrollBy({
    left: direction * 344,
    behavior: "smooth",
  });
};
</script>

<template>
  <CSection id="our-team" background-color="muted">
    <div class="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-start">
      <div>
        <CSectionHeading label="Our Team" title="Our Team" />
        <div class="space-y-8 text-foreground/70">
          <div>
            <h3 class="mb-2 font-['Playfair_Display'] text-2xl text-foreground">
              Church Council
            </h3>
            <p class="text-[16px] leading-relaxed">
              Our Church Council is made up of elected men and women from our
              church community who provide governance and oversight of our
              congregation and mission.
            </p>
          </div>
          <div>
            <h3 class="mb-2 font-['Playfair_Display'] text-2xl text-foreground">
              Staff &amp; Ministry Directors
            </h3>
            <p class="text-[16px] leading-relaxed">
              Our Staff and Ministry Directors lead the day-to-day ministry and
              support the people and teams of Hope Valley Church.
            </p>
          </div>
          <UButton
            v-if="canManageTeam"
            label="Add team member"
            icon="i-lucide-plus"
            color="primary"
            class="rounded-xl"
            @click="openCreateDialog"
          />
        </div>
      </div>

      <p v-if="isLoadingMembers" class="py-8 text-center text-muted-foreground">
        Loading team members...
      </p>
      <p v-else-if="membersError" class="py-8 text-center text-red-600">
        {{ membersError }}
      </p>
      <div
        v-else-if="teamMembers.length"
        class="min-w-0"
      >
        <div
          ref="teamMembersScroller"
          class="team-members-scroll flex gap-6 overflow-x-auto pb-4"
        >
          <article
            v-for="member in teamMembers"
            :key="member.email"
            class="group relative flex h-112 w-80 shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-cover bg-center p-6 shadow-sm"
            :style="{ backgroundImage: `url('${member.photo}')` }"
          >
            <UButton
              v-if="canManageTeam"
              icon="i-lucide-pencil"
              color="neutral"
              variant="soft"
              aria-label="Edit team member"
              class="absolute right-4 top-4 z-10 rounded-full bg-white/85"
              @click="openEditDialog(member)"
            />
            <div
              class="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent transition-opacity group-hover:from-black/90"
            />
            <div class="relative z-10">
              <h3 class="font-['Playfair_Display'] text-2xl text-white">
                {{ member.name }}
              </h3>
              <p class="mt-2 text-sm font-medium text-white/80">
                {{ member.title }}
              </p>
              <a
                :href="`mailto:${member.email}`"
                :aria-label="`Send email to ${member.name}`"
                class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <UIcon name="i-lucide-mail" class="size-4" />
                Contact
              </a>
            </div>
          </article>
        </div>
        <div class="mt-4 flex justify-end gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            color="primary"
            variant="outline"
            aria-label="Previous team member"
            class="rounded-full"
            @click="scrollMembers(-1)"
          />
          <UButton
            icon="i-lucide-arrow-right"
            color="primary"
            variant="outline"
            aria-label="Next team member"
            class="rounded-full"
            @click="scrollMembers(1)"
          />
        </div>
      </div>
      <p v-else class="text-center text-sm text-muted-foreground">
        No team members have been added yet.
      </p>
    </div>
    <TeamMemberDialog
      v-if="canManageTeam"
      v-model:open="isTeamMemberDialogOpen"
      :member="selectedMember"
      @saved="saveTeamMember"
      @deleted="removeTeamMember"
    />
  </CSection>
</template>

<style scoped>
.team-members-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.team-members-scroll::-webkit-scrollbar {
  display: none;
}
</style>
