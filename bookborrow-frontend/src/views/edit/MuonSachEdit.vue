<template>
    <div v-if="muonsach" class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">HIỆU CHỈNH MƯỢN SÁCH</h4>
        </div>
        <MuonSachForm :muonsach="muonsach" @submit:muonsach="updateMuonSach" @delete:muonsach="deleteMuonSach" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import MuonSachForm from '@/components/MuonSachForm.vue';
import MuonSachService from '@/services/theoDoiMuonSach.service';

export default {
    components: {
        MuonSachForm,
    },
    props: {
        id: { type: String, required: true },
    },

    data() {
        return {
            muonsach: null,
            message: '',
        };
    },
    methods: {
        async getMuonSach(id) {
            try {
                this.muonsach = (await MuonSachService.get(id))[0] || null;
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
        async updateMuonSach(data) {
            try {
                await MuonSachService.update(this.muonsach._id, data);
                confirm("Bản ghi mượn sách được cập nhật thành công");
                this.$router.push({ name: 'muonsach' });
            } catch (error) {
                console.log(error);
                this.message = 'Lỗi khi cập nhật Bản ghi mượn sách';
            }
        },

        async deleteMuonSach() {
            try {
                await MuonSachService.delete(this.muonsach._id);
                confirm("Bản ghi mượn sách được xóa thành công");
                this.$router.push({ name: 'muonsach' });
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        this.getMuonSach(this.id);
        this.message = '';
    },
};
</script>