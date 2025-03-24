<script>
import AppHeader from '@/components/AppHeader.vue';

export default {
  components: {
    AppHeader,
  },
};
</script>
<template>
  <div id="app">
    <AppHeader />
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<style>
/* Để trang rộng 100% */
body {
  width: 100%;
  margin: 0;
  padding: 0;
}

.page {
  max-width: 100%;
  margin: auto;
}
</style>