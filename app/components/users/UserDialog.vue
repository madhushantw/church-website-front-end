<script setup lang="ts">
import axios from 'axios'
import { UsersService, type CreateUser, type UserItem } from '~/services/users.service'
import { CInput } from '~/components/common'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  user?: UserItem | null
}>()
const emit = defineEmits<{
  saved: [user: UserItem]
}>()

const form = ref<CreateUser>({
  name: '',
  email: '',
  password: '',
})
const isLoading = ref(false)
const error = ref('')
const isEditing = computed(() => !!props.user)

watch(
  () => [open.value, props.user] as const,
  () => {
    if (!open.value) return

    form.value = {
      name: props.user?.name || '',
      email: props.user?.email || '',
      password: '',
    }
    error.value = ''
  },
  { immediate: true },
)

const close = () => {
  if (!isLoading.value) open.value = false
}

const saveUser = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = isEditing.value && props.user
      ? await UsersService.update(
          props.user.id,
          form.value.password
            ? form.value
            : { name: form.value.name, email: form.value.email }
        )
      : await UsersService.create(form.value)

    emit('saved', response.data)
    open.value = false
  } catch (e) {
    if (axios.isAxiosError(e)) {
      error.value = e.response?.data?.message?.[0] ?? 'Something went wrong'
    } else {
      error.value = 'Something went wrong'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-foreground/30 backdrop-blur-sm',
      content: 'max-w-md rounded-3xl border border-primary/10 bg-background shadow-2xl',
    }"
  >
    <template #content>
      <form class="p-6 sm:p-8" @submit.prevent="saveUser">
        <div class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              User management
            </p>
            <h2 class="font-['Playfair_Display'] text-3xl text-foreground">
              {{ isEditing ? 'Edit user' : 'Create a user' }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ isEditing ? 'Update this account details.' : 'Add a new account to Grace Community.' }}
            </p>
          </div>
          <UButton
            type="button"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close user dialog"
            class="rounded-full"
            @click="close"
          />
        </div>
        <div class="space-y-4">
          <CInput
            v-model="form.name"
            label="Name"
            placeholder="Full name"
            required
            class="w-full"
          />
          <CInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Email address"
            required
            class="w-full"
          />
          <CInput
            v-model="form.password"
            label="Password"
            type="password"
            :placeholder="isEditing ? 'Leave blank to keep current password' : 'At least 6 characters'"
            :required="!isEditing"
            class="w-full"
          />
        </div>
        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <UButton
            type="button"
            label="Cancel"
            color="neutral"
            variant="soft"
            class="rounded-xl"
            :disabled="isLoading"
            @click="close"
          />
          <UButton
            type="submit"
            :label="isEditing ? 'Save changes' : 'Create user'"
            :icon="isEditing ? 'i-lucide-check' : 'i-lucide-user-plus'"
            color="primary"
            class="rounded-xl"
            :loading="isLoading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
