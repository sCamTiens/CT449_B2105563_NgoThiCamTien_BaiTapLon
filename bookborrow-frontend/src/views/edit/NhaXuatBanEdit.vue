<template>
    <div v-if="nhaxuatban" class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">HIỆU CHỈNH NHÀ XUẤT BẢN</h4>
        </div>
        <NhaXuatBanForm :nhaxuatban="nhaxuatban" @submit:nhaxuatban="updateNhaxuatban"
            @delete:nhaxuatban="deleteNhaxuatban" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import NhaXuatBanForm from '@/components/NhaXuatBanForm.vue';
import NhaXuatBanService from '@/services/nhaXuatBan.service';

export default {
    components: {
        NhaXuatBanForm,
    },
    props: {
        id: { type: String, required: true },
    },

    data() {
        return {
            nhaxuatban: null,
            message: '',
        };
    },
    methods: {
        async getNhaXuatBan(id) {
            try {
                this.nhaxuatban = (await NhaXuatBanService.get(id))[0] || null;
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
        async updateNhaxuatban(data) {
            try {
                await NhaXuatBanService.update(this.nhaxuatban._id, data);
                this.message = 'Nhà Xuất Bản được cập nhật thành công';
            } catch (error) {
                console.log(error);
                this.message = 'Lỗi khi cập nhật Nhà Xuất Bản';
            }
        },

        async deleteNhaxuatban() {
            try {
                await NhaXuatBanService.delete(this.nhaxuatban._id);
                this.$router.push({ name: 'nhaxuatban' });
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        this.getNhaXuatBan(this.id);
        this.message = '';
    },
};
</script>