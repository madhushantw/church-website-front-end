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
const reorderError = ref("");
const liveMessage = ref("");
const isTeamMemberDialogOpen = ref(false);
const selectedMember = ref<TeamMember | null>(null);

const canManageTeam = computed(() => userStore.user?.role === UserRole.ROOT || userStore.user?.role === UserRole.ADMIN);

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

onMounted(loadTeamMembers);

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
  if (index === -1) teamMembers.value = [member, ...teamMembers.value];
  else teamMembers.value[index] = member;
  selectedMember.value = null;
};

const removeTeamMember = (id: string) => {
  teamMembers.value = teamMembers.value.filter((member) => member.id !== id);
  selectedMember.value = null;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const teamMembersScroller = ref<HTMLElement | null>(null);
const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const thumbRatio = ref(1);
const scrollProgress = ref(0);

const updateScrollState = () => {
  const el = teamMembersScroller.value;
  if (!el) return;

  const max = el.scrollWidth - el.clientWidth;
  canScrollPrev.value = el.scrollLeft > 4;
  canScrollNext.value = el.scrollLeft < max - 4;
  thumbRatio.value = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
  scrollProgress.value = max > 0 ? el.scrollLeft / max : 0;
};

watch(teamMembersScroller, (el, _previous, onCleanup) => {
  if (!el) return;

  const observer = new ResizeObserver(updateScrollState);
  observer.observe(el);
  if (el.firstElementChild) observer.observe(el.firstElementChild);
  updateScrollState();

  onCleanup(() => observer.disconnect());
});

watch(teamMembers, () => nextTick(updateScrollState), { flush: "post" });

const thumbStyle = computed(() => ({
  width: `${thumbRatio.value * 100}%`,
  left: `${scrollProgress.value * (1 - thumbRatio.value) * 100}%`,
}));

const scrollMembers = (direction: -1 | 1) => {
  const card = teamMembersScroller.value?.querySelector("article");
  const step = (card?.offsetWidth ?? 320) + 24; // card width + gap-6
  teamMembersScroller.value?.scrollBy({
    left: direction * step,
    behavior: "smooth",
  });
};

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSnapshot: TeamMember[] | null = null;

const flushSave = async () => {
  saveTimer = null;
  const previous = pendingSnapshot;
  pendingSnapshot = null;
  if (!previous) return;

  try {
    await TeamMembersService.reorder(teamMembers.value.map((m) => m.id));
  } catch {
    teamMembers.value = previous;
    reorderError.value =
      "Couldn't save the new order, so it was put back. Please try again.";
  }
};

const queueSave = (previous: TeamMember[], delay = 500) => {
  pendingSnapshot ??= previous;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, delay);
};

const cardEls = new Map<string, HTMLElement>();
const handleEls = new Map<string, HTMLElement>();

const setEl = (map: Map<string, HTMLElement>, id: string, el: unknown) => {
  if (el instanceof HTMLElement) map.set(id, el);
  else map.delete(id);
};

const draggingId = ref<string | null>(null);
const draggedMember = computed(
  () => teamMembers.value.find((m) => m.id === draggingId.value) ?? null,
);
const ghost = reactive({ x: 0, y: 0, width: 0, height: 0 });

let grabOffset = { x: 0, y: 0 };
let activePointerId: number | null = null;
let orderBeforeDrag: TeamMember[] = [];
let lastPointerX = 0;

let autoScrollFrame: number | null = null;
let autoScrollSpeed = 0;
let lastFrameTime = 0;

const stopAutoScroll = () => {
  autoScrollSpeed = 0;
  lastFrameTime = 0;
  if (autoScrollFrame !== null) {
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }
};

const runAutoScroll = (timestamp: number) => {
  const scroller = teamMembersScroller.value;
  if (!autoScrollSpeed || !scroller) {
    autoScrollFrame = null;
    lastFrameTime = 0;
    return;
  }

  if (lastFrameTime) {
    const delta = Math.min(timestamp - lastFrameTime, 32);
    scroller.scrollLeft += autoScrollSpeed * delta;
    reorderAt(lastPointerX);
  }

  lastFrameTime = timestamp;
  autoScrollFrame = requestAnimationFrame(runAutoScroll);
};

const updateAutoScroll = (clientX: number, clientY: number) => {
  const scroller = teamMembersScroller.value;
  if (!scroller) return;

  const rect = scroller.getBoundingClientRect();
  const edge = 110;
  const nearRow = clientY > rect.top - 160 && clientY < rect.bottom + 160;
  const fromLeft = clientX - rect.left;
  const fromRight = rect.right - clientX;

  let speed = 0;
  if (nearRow && fromLeft < edge) speed = -(1 - Math.max(fromLeft, 0) / edge);
  else if (nearRow && fromRight < edge) speed = 1 - Math.max(fromRight, 0) / edge;

  if (!speed) {
    stopAutoScroll();
    return;
  }

  autoScrollSpeed = speed * 0.9; // px per ms at full speed
  if (autoScrollFrame === null) {
    autoScrollFrame = requestAnimationFrame(runAutoScroll);
  }
};

const reorderAt = (clientX: number) => {
  const id = draggingId.value;
  const track = teamMembersScroller.value?.firstElementChild;
  if (!id || !track) return;

  const x = clientX - track.getBoundingClientRect().left;
  const target = teamMembers.value.find((member) => {
    if (member.id === id) return false;
    const el = cardEls.get(member.id);
    return !!el && x >= el.offsetLeft && x <= el.offsetLeft + el.offsetWidth;
  });
  if (!target) return;

  const from = teamMembers.value.findIndex((m) => m.id === id);
  const to = teamMembers.value.findIndex((m) => m.id === target.id);
  if (from === -1 || to === -1 || from === to) return;

  const next = [...teamMembers.value];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved!);
  teamMembers.value = next;
};

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) return;

  lastPointerX = event.clientX;
  ghost.x = event.clientX - grabOffset.x;
  ghost.y = event.clientY - grabOffset.y;

  updateAutoScroll(event.clientX, event.clientY);
  reorderAt(event.clientX);
};

const onPointerUp = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) return;
  endDrag(true);
};

const onPointerCancel = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) return;
  endDrag(false);
};

const onDragKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") endDrag(false);
};

const endDrag = (commit: boolean) => {
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerCancel);
  window.removeEventListener("keydown", onDragKeydown);

  stopAutoScroll();
  document.body.style.cursor = "";
  document.body.style.userSelect = "";

  const before = orderBeforeDrag;
  draggingId.value = null;
  activePointerId = null;

  if (!commit) {
    teamMembers.value = before;
    return;
  }

  const changed = teamMembers.value.some((m, i) => m.id !== before[i]?.id);
  if (changed) queueSave(before, 0);
};

const startDrag = (member: TeamMember, event: PointerEvent) => {
  if (!canManageTeam.value || draggingId.value) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;

  const card = cardEls.get(member.id);
  if (!card) return;

  event.preventDefault();

  const rect = card.getBoundingClientRect();
  grabOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  Object.assign(ghost, {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  });

  activePointerId = event.pointerId;
  lastPointerX = event.clientX;
  orderBeforeDrag = [...teamMembers.value];
  reorderError.value = "";
  draggingId.value = member.id;

  document.body.style.cursor = "grabbing";
  document.body.style.userSelect = "none";

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);
  window.addEventListener("keydown", onDragKeydown);
};

const onHandleKeydown = async (member: TeamMember, event: KeyboardEvent) => {
  if (!canManageTeam.value) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  event.preventDefault();

  const direction = event.key === "ArrowLeft" ? -1 : 1;
  const index = teamMembers.value.findIndex((m) => m.id === member.id);
  const nextIndex = index + direction;
  if (index === -1 || nextIndex < 0 || nextIndex >= teamMembers.value.length) {
    return;
  }

  const before = [...teamMembers.value];
  const reordered = [...teamMembers.value];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(nextIndex, 0, moved!);

  reorderError.value = "";
  teamMembers.value = reordered;
  liveMessage.value = `${member.name} moved to position ${nextIndex + 1} of ${reordered.length}.`;
  queueSave(before);

  await nextTick();
  handleEls.get(member.id)?.focus({ preventScroll: true });
  cardEls
    .get(member.id)
    ?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
};

onBeforeUnmount(() => {
  endDrag(false);
  if (saveTimer) clearTimeout(saveTimer);
});
</script>

<template>
  <CSection id="our-team" background-color="muted">
    <div class="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-start">
      <div>
        <CSectionHeading label="" title="Our Team" />
        <div class="space-y-8 text-foreground/70">
          <h3 class="mb-2 font-['Playfair_Display'] text-2xl text-foreground">
            Meet the People Behind St Luke’s
          </h3>
          <p class="text-[16px] leading-relaxed">
            Our clergy, Church Council, and dedicated volunteers work together
            to nurture faith, support our congregation, and serve the Modbury
            community. Guided by Christ’s love, we strive to create a welcoming
            and caring church where everyone belongs.
          </p>

          <div v-if="canManageTeam" class="space-y-3">
            <UButton
              label="Add team member"
              icon="i-lucide-plus"
              color="primary"
              variant="soft"
              class="rounded-xl"
              @click="openCreateDialog"
            />
            <p
              v-if="teamMembers.length > 1"
              class="flex items-center gap-2 text-sm text-foreground/60"
            >
              <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0" />
              Drag the grip on a card to reorder, or focus it and use the arrow
              keys.
            </p>
            <p
              v-if="reorderError"
              role="alert"
              class="flex items-start gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700"
            >
              <UIcon
                name="i-lucide-circle-alert"
                class="mt-0.5 size-4 shrink-0"
              />
              {{ reorderError }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="isLoadingMembers"
        class="flex gap-6 overflow-hidden pb-4"
        aria-busy="true"
        aria-label="Loading team members"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="h-112 w-80 shrink-0 animate-pulse rounded-2xl bg-foreground/10"
        />
      </div>

      <div
        v-else-if="membersError"
        class="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-red-300 bg-red-500/5 px-6 py-12 text-center"
      >
        <p class="text-red-700">{{ membersError }}</p>
        <UButton
          label="Try again"
          icon="i-lucide-rotate-cw"
          color="neutral"
          variant="outline"
          class="rounded-xl"
          @click="loadTeamMembers"
        />
      </div>

      <div v-else-if="teamMembers.length" class="min-w-0">
        <p class="sr-only" aria-live="polite">{{ liveMessage }}</p>

        <div
          ref="teamMembersScroller"
          class="team-members-scroll overflow-x-auto pb-4"
          @scroll.passive="updateScrollState"
        >
          <TransitionGroup
            name="team-card"
            tag="div"
            class="relative flex w-max gap-6"
          >
            <article
              v-for="member in teamMembers"
              :key="member.id"
              :ref="(el) => setEl(cardEls, member.id, el)"
              class="group relative flex h-112 w-80 shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-foreground p-6 shadow-sm transition duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none"
              :class="
                draggingId === member.id
                  ? 'scale-[0.97] opacity-35 outline-2 -outline-offset-2 outline-dashed outline-primary'
                  : ''
              "
            >
              <img
                v-if="member.photo"
                :src="member.photo"
                :alt="member.name"
                loading="lazy"
                decoding="async"
                draggable="false"
                class="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
              >
              <div
                v-else
                class="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/70 to-primary pb-20 font-['Playfair_Display'] text-7xl text-white/90"
                aria-hidden="true"
              >
                {{ initials(member.name) }}
              </div>

              <div
                v-if="canManageTeam"
                class="pointer-events-none absolute right-4 top-4 z-10 flex gap-2 opacity-0 transition duration-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 pointer-coarse:pointer-events-auto pointer-coarse:opacity-100 motion-reduce:transition-none"
              >
                <button
                  :ref="(el) => setEl(handleEls, member.id, el)"
                  type="button"
                  :aria-label="`Reorder ${member.name}. Drag, or use the left and right arrow keys.`"
                  class="flex size-9 cursor-grab touch-none items-center justify-center rounded-full bg-white/85 text-gray-900 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:cursor-grabbing"
                  @pointerdown="startDrag(member, $event)"
                  @keydown="onHandleKeydown(member, $event)"
                >
                  <UIcon name="i-lucide-grip-vertical" class="size-4" />
                </button>

                <button
                  type="button"
                  aria-label="Edit team member"
                  class="flex size-9 items-center justify-center rounded-full bg-white/85 text-gray-900 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  @click="openEditDialog(member)"
                >
                  <UIcon name="i-lucide-pencil" class="size-4" />
                </button>
              </div>

              <div
                class="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/90"
              />

              <div class="relative z-10">
                <h3 class="font-['Playfair_Display'] text-2xl text-white">
                  {{ member.name }}
                </h3>
                <p class="mt-2 text-sm font-medium text-white/80">
                  {{ member.title }}
                </p>
                <p class="text-sm font-medium text-white/80">
                  {{ member.email }}
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
          </TransitionGroup>
        </div>

        <div class="mt-4 flex items-center gap-4">
          <div
            v-if="thumbRatio < 1"
            class="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/10"
            aria-hidden="true"
          >
            <div
              class="absolute inset-y-0 rounded-full bg-primary"
              :style="thumbStyle"
            />
          </div>
          <div v-else class="flex-1" />

          <div class="flex gap-3">
            <UButton
              icon="i-lucide-arrow-left"
              color="primary"
              variant="outline"
              aria-label="Previous team member"
              class="rounded-full"
              :disabled="!canScrollPrev"
              @click="scrollMembers(-1)"
            />
            <UButton
              icon="i-lucide-arrow-right"
              color="primary"
              variant="outline"
              aria-label="Next team member"
              class="rounded-full"
              :disabled="!canScrollNext"
              @click="scrollMembers(1)"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-foreground/20 px-6 py-12 text-center"
      >
        <UIcon name="i-lucide-users" class="size-8 text-foreground/40" />
        <p class="text-sm text-foreground/60">
          No team members have been added yet.
        </p>
        <UButton
          v-if="canManageTeam"
          label="Add the first team member"
          icon="i-lucide-plus"
          color="primary"
          variant="soft"
          class="rounded-xl"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="draggedMember"
        class="pointer-events-none fixed left-0 top-0 z-100"
        :style="{
          width: `${ghost.width}px`,
          height: `${ghost.height}px`,
          transform: `translate3d(${ghost.x}px, ${ghost.y}px, 0)`,
        }"
      >
        <div
          class="team-ghost relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl bg-foreground p-6 shadow-2xl shadow-black/40 ring-2 ring-primary"
        >
          <img
            v-if="draggedMember.photo"
            :src="draggedMember.photo"
            :alt="''"
            draggable="false"
            class="absolute inset-0 h-full w-full object-cover"
          >
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/70 to-primary pb-20 font-['Playfair_Display'] text-7xl text-white/90"
          >
            {{ initials(draggedMember.name) }}
          </div>
          <div
            class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"
          />
          <div class="relative z-10">
            <p class="font-['Playfair_Display'] text-2xl text-white">
              {{ draggedMember.name }}
            </p>
            <p class="mt-2 text-sm font-medium text-white/80">
              {{ draggedMember.title }}
            </p>
            <p class="text-sm font-medium text-white/80">
              {{ draggedMember.email }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>

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

.team-card-move {
  transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.team-card-enter-active,
.team-card-leave-active {
  transition:
    opacity 220ms ease,
    scale 220ms ease;
}

.team-card-enter-from,
.team-card-leave-to {
  opacity: 0;
  scale: 0.92;
}

.team-ghost {
  rotate: 2deg;
  animation: team-ghost-lift 160ms ease-out forwards;
}

@keyframes team-ghost-lift {
  from {
    scale: 1;
  }
  to {
    scale: 1.04;
  }
}

@media (prefers-reduced-motion: reduce) {
  .team-card-move,
  .team-card-enter-active,
  .team-card-leave-active {
    transition: none;
  }

  .team-ghost {
    animation: none;
    scale: 1.04;
  }
}
</style>