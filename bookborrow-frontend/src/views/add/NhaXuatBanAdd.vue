<template>
    <div class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">THÊM MỚI NHÀ XUẤT BẢN</h4>
        </div>
        <NhaXuatBanForm :nhaxuatban="nhaxuatban" @submit:nhaxuatban="createNhaXuatBan" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import NhaXuatBanForm from '@/components/NhaXuatBanForm.vue';  // Import form thêm nhà xuất bản
import NhaXuatBanService from '@/services/nhaXuatBan.service';  // Import service để xử lý nhà xuất bản

export default {
    components: {
        NhaXuatBanForm,
    },
    data() {
        return {
            nhaxuatban: {
                MaNXB: "",  // Mã nhà xuất bản (sẽ tự động sinh khi thêm mới)
                TenNXB: "",  // Tên nhà xuất bản
                DiaChi: "",  // Địa chỉ
            },
            message: '',
        };
    },
    methods: {
        async createNhaXuatBan(data) {
            try {
                // Call NhaXuatBanService để tạo mới nhà xuất bản
                await NhaXuatBanService.create(data);
                //this.message = 'Nhà xuất bản được thêm thành công';
                confirm("Nhà xuất bản được thêm thành công")
                // this.resetForm();
                this.$router.push({ name: 'nhaxuatban' });

            } catch (error) {
                console.log(error);
                this.message = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            }
        },
        resetForm() {
            // Reset form sau khi thêm nhà xuất bản thành công
            this.nhaxuatban = {
                MaNXB: "",
                TenNXB: "",
                DiaChi: "",
            };
        }
    },
    created() {
        this.message = '';
    },
};
</script>
