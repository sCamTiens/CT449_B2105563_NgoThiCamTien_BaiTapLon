<script>
import AppHeader from '@/components/AppHeader.vue';
import SideBar from '@/components/SideBar.vue';

export default {
  components: {
    AppHeader,
    SideBar,
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("nhanvien");
    }
  }
};
</script>
<template>
  <div id="app">
    <AppHeader />
    <div class="main mt-3">
      <div class="row">
        <!-- Chỉ hiển thị Sidebar nếu đã đăng nhập -->
        <div class="col-md-3" v-if="isLoggedIn">
          <SideBar />
        </div>

        <!-- Phần nội dung chiếm toàn bộ nếu chưa đăng nhập -->
        <div :class="isLoggedIn ? 'col-md-9' : 'col-md-12'">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.page {
  max-width: 100%;
  margin: auto;
}

.main {
  padding: 20px;
  padding-right: 100px;
}
</style>