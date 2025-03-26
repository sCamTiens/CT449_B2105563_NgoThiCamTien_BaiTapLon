<template>
    <div v-if="docgia" class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">HIỆU CHỈNH ĐỌC GIẢ</h4>
        </div>
        <DocGiaForm :docgia="docgia" @submit:docgia="updateDocgia" @delete:docgia="deleteDocgia" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import DocGiaForm from '@/components/DocGiaForm.vue';
import DocGiaService from '@/services/docGia.service';

export default {
    components: {
        DocGiaForm,
    },
    props: {
        id: { type: String, required: true },
    },

    data() {
        return {
            docgia: null,
            message: '',
        };
    },
    methods: {
        async getDocgia(id) {
            try {
                this.docgia = (await DocGiaService.get(id))[0] || null;
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
        async updateDocgia(data) {
            try {
                await DocGiaService.update(this.docgia._id, data);
                confirm("Đọc giả được cập nhật thành công");
                this.$router.push({ name: 'docgia' });
            } catch (error) {
                console.log(error);
                this.message = 'Lỗi khi cập nhật đọc giả';
            }
        },

        async deleteDocgia() {
            try {
                await DocGiaService.delete(this.docgia._id);
                confirm("Đọc giả được xóa thành công");
                this.$router.push({ name: 'docgia' });
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        this.getDocgia(this.id);
        this.message = '';
    },
};
</script>