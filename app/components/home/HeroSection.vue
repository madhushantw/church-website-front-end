<script setup lang="ts">
import { HeroService, type Hero } from '~/services/hero.service'
import { UserRole } from '~/services/auth.service'
import { useUserStore } from '~/stores/user.store'
import { CButton } from '../common'
import HeroEditDialog from './HeroEditDialog.vue'

const fallbackHero: Required<Hero> = {
  welcomeText: 'Welcome Home',
  title1: 'A Place of Faith,',
  title2: 'Hope & Community',
  subtitle:
    'We are a family of believers committed to worship, growth, and serving one another and our community. All are welcome here.',
  image:
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&h=900&fit=crop&auto=format',
}

const hero = ref<Hero>(fallbackHero)
const userStore = useUserStore()
const isEditDialogOpen = ref(false)
const editingField = ref<keyof Hero | null>(null)
const canEdit = computed(() => userStore.user?.role === UserRole.ROOT)

const editField = (field: keyof Hero) => {
  editingField.value = field
  isEditDialogOpen.value = true
}

const setUpdatedHero = (updatedHero: Hero) => {
  hero.value = updatedHero
}

const getHeroData = async () => {
  try {
    const { data } = await HeroService.get()
    hero.value = data
  } catch (error) {
    console.error('Error fetching hero data:', error)
  }
}

onMounted(getHeroData)
</script>

<template>
  <section
    id="home"
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <img
      :src="hero?.image || fallbackHero.image"
      alt="Congregation in worship"
      class="absolute inset-0 w-full h-full object-cover -z-20"
    >
    <div class="absolute inset-0 bg-linear-to-b from-[#1C2B2A]/75 via-[#1C2B2A]/55 to-[#1C2B2A]/80" />
    <UButton
      v-if="canEdit"
      icon="i-lucide-pencil"
      color="neutral"
      variant="solid"
      size="xs"
      aria-label="Edit hero background image"
      class="absolute bottom-5 right-5 z-20 rounded-full opacity-10 shadow-lg transition-opacity hover:opacity-80"
      @click="editField('image')"
    />
    <UContainer class="relative z-10 mx-auto max-w-4xl px-6 text-center">
      <div class="relative mb-8 inline-flex items-center gap-2">
        <div class="h-px w-8 bg-accent" />
        <span class="text-accent text-[13px] font-medium uppercase tracking-[0.25em]">
          {{ hero?.welcomeText || fallbackHero.welcomeText }}
        </span>
        <div class="h-px w-8 bg-accent" />
        <UButton
          v-if="canEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="solid"
          size="xs"
          aria-label="Edit welcome text"
          class="absolute -bottom-3 -right-8 rounded-full opacity-10 transition-opacity hover:opacity-80"
          @click="editField('welcomeText')"
        />
      </div>
      <h1 class="relative mb-6 font-['Playfair_Display'] text-6xl leading-tight text-white md:text-7xl lg:text-8xl">
        {{ hero?.title1 || fallbackHero.title1 }}
        <br>
        <span class="relative italic text-accent">
          {{ hero?.title2 || fallbackHero.title2 }}
          <UButton
            v-if="canEdit"
            icon="i-lucide-pencil"
            color="neutral"
            variant="solid"
            size="xs"
            aria-label="Edit second title line"
            class="absolute -bottom-2 -right-8 rounded-full opacity-10 transition-opacity hover:opacity-80 not-italic"
            @click="editField('title2')"
          />
        </span>
        <UButton
          v-if="canEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="solid"
          size="xs"
          aria-label="Edit first title line"
          class="absolute bottom-0 right-0 rounded-full opacity-10 transition-opacity hover:opacity-80"
          @click="editField('title1')"
        />
      </h1>
      <p class="relative mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-white/80 md:text-xl">
        {{ hero?.subtitle || fallbackHero.subtitle }}
        <UButton
          v-if="canEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="solid"
          size="xs"
          aria-label="Edit hero subtitle"
          class="absolute -bottom-3 right-0 rounded-full opacity-10 transition-opacity hover:opacity-80"
          @click="editField('subtitle')"
        />
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <CButton title="Discover Our Church" />
        <CButton title="Watch a Sermon" outlined color="neutral" prepend-icon="solar:play-outline" />
      </div>
    </UContainer>
    <HeroEditDialog
      v-if="canEdit"
      v-model:open="isEditDialogOpen"
      :hero="hero"
      :field="editingField"
      @updated="setUpdatedHero"
    />
  </section>
</template>
