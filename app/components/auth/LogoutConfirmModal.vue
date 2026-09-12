<script setup lang="ts">
import { useUserStore } from "~/stores/user.store";
import ConfirmationDialog from "../common/ConfirmationDialog.vue";

const open = defineModel<boolean>("open", { default: false });
const userStore = useUserStore();

const logout = () => {
  userStore.signOut();
  open.value = false;
};
</script>

<template>
  <ConfirmationDialog
    v-model="open"
    type="logout"
    title="Sign out?"
    subtitle="Are you sure you want to sign out of Grace Community?"
    @confirm="logout"
  />
</template>
