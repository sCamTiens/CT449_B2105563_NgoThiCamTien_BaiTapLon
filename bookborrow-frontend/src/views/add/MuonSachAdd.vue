<template>
    <div class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">THÊM MỚI MƯỢN SÁCH</h4>
        </div>
        <MuonSachForm :muonsach="muonsach" @submit:muonsach="createMuonSach" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import MuonSachForm from '@/components/MuonSachForm.vue';  // Import form mượn sách
import MuonSachService from '@/services/theoDoiMuonSach.service';  // Import service để xử lý mượn sách

export default {
    components: {
        MuonSachForm,
    },
    data() {
        return {
            muonsach: {
                MaDocGia: "",  // Mã độc giả
                MaSach: "",  // Mã sách
                NgayMuon: "",  // Ngày mượn
                NgayTra: "",  // Ngày trả
            },
            message: '',
        };
    },
    methods: {
        async createMuonSach(data) {
            try {
                // Call MuonSachService để tạo mới mượn sách
                await MuonSachService.create(data);
                confirm("Mượn sách thành công");
                this.$router.push({ name: 'muonsach' });
            } catch (error) {
                console.log(error);
                this.message = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            }
        },
        resetForm() {
            // Reset form sau khi thêm mượn sách thành công
            this.muonsach = {
                MaDocGia: "",
                MaSach: "",
                NgayMuon: "",
                NgayTra: "",
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
