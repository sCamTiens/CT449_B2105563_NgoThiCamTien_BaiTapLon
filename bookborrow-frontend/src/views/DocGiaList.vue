<!-- Trang quản lý độc giả -->
<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>

        <div class="mt-3 col-md-6">
            <h4>
                Danh sách Độc giả
                <i class="fas fa-users"></i>
            </h4>
            <List v-if="filteredDocGiaCount > 0" :items="filteredDocGia" v-model:activeIndex="activeIndex" />
            <p v-else>Không có độc giả nào.</p>

            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddDocGia">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllDocGia">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>

        <div class="mt-3 col-md-6">
            <div v-if="activeDocGia">
                <h4>
                    Chi tiết Độc giả
                    <i class="fas fa-info-circle"></i>
                </h4>
                <EntityCard :data="activeDocGia" type="docgia" />
                <router-link :to="{ name: 'docgia.edit', params: { id: activeDocGia._id } }">
                    <span class="mt-2 badge badge-warning">
                        <i class="fas fa-edit"></i> Hiệu chỉnh
                    </span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';
import List from '@/components/List.vue';
import EntityCard from '@/components/EntityCard.vue';
import DocGiaService from '@/services/docgia.service.js';

export default {
    components: {
        InputSearch,
        List,
        EntityCard,
    },
    data() {
        return {
            docgiaList: [],
            activeIndex: -1,
            searchText: '',
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        docgiaStrings() {
            return this.docgiaList.map((dg) => {
                const { MaDocGia, HoLot, Ten, DiaChi } = dg;
                return [MaDocGia, HoLot, Ten, DiaChi].join('');
            });
        },
        filteredDocGia() {
            if (!this.searchText) return this.docgiaList;
            return this.docgiaList.filter((_dg, index) =>
                this.docgiaStrings[index].toLowerCase().includes(this.searchText.toLowerCase())
            );
        },
        activeDocGia() {
            if (this.activeIndex < 0) return null;
            return this.filteredDocGia[this.activeIndex];
        },
        filteredDocGiaCount() {
            return this.filteredDocGia.length;
        },
    },
    methods: {
        async retrieveDocGia() {
            try {
                this.docgiaList = await DocGiaService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveDocGia();
            this.activeIndex = -1;
        },
        async removeAllDocGia() {
            if (confirm('Bạn muốn xóa tất cả độc giả?')) {
                try {
                    await DocGiaService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddDocGia() {
            this.$router.push({ name: 'docgia.add' });
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>

<style scoped>
.page {
    text-align: left;
    max-width: 100%;
}
</style>
