<template>
    <div class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">THÊM MỚI ĐỘC GIẢ</h4>
        </div>
        <DocGiaForm :docgia="docgia" @submit:docgia="createDocGia" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import DocGiaForm from '@/components/DocGiaForm.vue';  // Import form của Đọc Giả
import DocGiaService from '@/services/docGia.service';  // Import service của Đọc Giả

export default {
    components: {
        DocGiaForm,
    },
    data() {
        return {
            docgia: {
                MaDocGia: "",  // Mã độc giả (sẽ tự động sinh khi thêm mới)
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "",
                DiaChi: "",
                DienThoai: "",
            },
            message: '',
        };
    },
    methods: {
        async createDocGia(data) {
            try {
                // Call DocGiaService để tạo mới độc giả
                await DocGiaService.create(data);
                confirm("Đọc giả đã được thêm thành công");
                this.$router.push({ name: 'docgia' });
            } catch (error) {
                console.log(error);
                this.message = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            }
        },
        resetForm() {
            // Reset form sau khi thêm mới thành công
            this.docgia = {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "",
                DiaChi: "",
                DienThoai: "",
            };
        }
    },
    created() {
        this.message = '';
    },
};
</script>

<style scoped>
.page {
    text-align: left;
    max-width: 100%;
}
</style>
