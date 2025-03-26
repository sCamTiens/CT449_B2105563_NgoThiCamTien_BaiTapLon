<template>
    <div class="page">
        <h4>Thêm Nhân Viên Mới</h4>
        <NhanVienForm :nhanvien="nhanvien" @submit:nhanvien="createNhanVien" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import NhanVienForm from '@/components/NhanVienForm.vue';  // Import form thêm nhân viên
import NhanVienService from '@/services/nhanVien.service';  // Import service để xử lý nhân viên

export default {
    components: {
        NhanVienForm,
    },
    data() {
        return {
            nhanvien: {
                MSNV: "",  // Mã nhân viên (sẽ tự động sinh nếu cần)
                HoTenNV: "",  // Họ tên nhân viên
                Password: "", // Mật khẩu nhân viên
                ChucVu: "",  // Chức vụ
                DiaChi: "",  // Địa chỉ
                SoDienThoai: "",  // Số điện thoại
            },
            message: '',
        };
    },
    methods: {
        async createNhanVien(data) {
            try {
                // Call NhanVienService để tạo mới nhân viên
                await NhanVienService.create(data);
                confirm("Nhân viên được thêm thành công");
                this.$router.push({ name: 'nhanvien' });
            } catch (error) {
                console.log(error);
                this.message = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            }
        },
        resetForm() {
            // Reset form sau khi thêm nhân viên thành công
            this.nhanvien = {
                MSNV: "",
                HoTenNV: "",
                Password: "",
                ChucVu: "",
                DiaChi: "",
                SoDienThoai: "",
            };
        }
    },
    created() {
        this.message = '';
    },
};
</script>
