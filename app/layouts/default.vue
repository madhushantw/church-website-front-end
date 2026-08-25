<script setup lang="ts">
    // import AppFooter from './AppFooter.vue';
    import AppHeader from './AppHeader.vue'

</script>

<template>
  <div class="min-h-screen">
    <AppHeader />
    <main>
      <slot />
    </main>
    <!-- <AppFooter /> -->
  </div>
</template>