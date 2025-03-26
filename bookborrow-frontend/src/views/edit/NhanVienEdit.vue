<template>
    <div v-if="nhanvien" class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">HIỆU CHỈNH NHÂN VIÊN</h4>
        </div>
        <NhanVienForm :nhanvien="nhanvien" @submit:nhanvien="updateNhanvien" @delete:nhanvien="deleteNhanvien" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import NhanVienForm from '@/components/NhanVienForm.vue';
import NhanVienService from '@/services/nhanVien.service';

export default {
    components: {
        NhanVienForm,
    },
    props: {
        id: { type: String, required: true },
    },

    data() {
        return {
            nhanvien: null,
            message: '',
        };
    },
    methods: {
        async getNhanvien(id) {
            try {
                this.nhanvien = (await NhanVienService.get(id))[0] || null;
            } catch (error) {
                console.log(error);
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                this.$router.push({
                    name: 'notfound',
                    params: {
                        pathMatch: this.$route.path.split('/').slice(1)
                    },
                    query: this.$route.query,
                    hash: this.$route.hash
                });
            }
        },
        async updateNhanvien(data) {
            try {
                await NhanVienService.update(this.nhanvien._id, data);
                confirm("Nhân viên được cập nhật thành công");
                this.$router.push({ name: 'nhanvien' });
            } catch (error) {
                console.log(error);
                this.message = 'Lỗi khi cập nhật nhân viên';
            }
        },

        async deleteNhanvien() {
            try {
                await NhanVienService.delete(this.nhanvien._id);
                confirm("Nhân viên được xóa thành công");
                this.$router.push({ name: 'nhanvien' });
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        this.getNhanvien(this.id);
        this.message = '';
    },
};
</script>