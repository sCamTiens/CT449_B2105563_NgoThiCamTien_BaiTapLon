<template>
    <div class="page text-center">
        <h4>Đang đăng xuất...</h4>
        <p>Bạn sẽ được chuyển hướng trong giây lát.</p>
    </div>
</template>

<script>
export default {
    mounted() {
        // Xoá thông tin người dùng khỏi localStorage
        localStorage.removeItem("nhanvien");

        // Chuyển về trang login sau 1-2 giây
        setTimeout(() => {
            window.location.href = "/login";
        }, 1500);
    },
};
</script>

<style scoped>
.page {
    margin-top: 100px;
    text-align: center;
}
</style>
