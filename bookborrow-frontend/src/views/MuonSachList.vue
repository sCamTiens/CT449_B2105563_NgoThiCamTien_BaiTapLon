<!-- MuonSachList.vue - Quản lý theo dõi mượn sách -->
<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>

        <div class="mt-3 col-md-6">
            <h4>
                Danh sách Mượn Sách
                <i class="fas fa-book-reader"></i>
            </h4>
            <List v-if="filteredRecordsCount > 0" :items="filteredRecords" v-model:activeIndex="activeIndex" />
            <p v-else>Không có bản ghi nào.</p>

            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAdd">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAll">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>

        <div class="mt-3 col-md-6">
            <div v-if="activeRecord">
                <h4>
                    Chi tiết Mượn Sách
                    <i class="fas fa-info-circle"></i>
                </h4>
                <EntityCard :data="activeRecord" type="muon" />
                <router-link :to="{ name: 'muon.edit', params: { id: activeRecord._id } }">
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
import TheoDoiMuonSachService from '@/services/theoDoiMuonSach.service.js';

export default {
    components: {
        InputSearch,
        List,
        EntityCard,
    },
    data() {
        return {
            records: [],
            activeIndex: -1,
            searchText: '',
        };
    },
    computed: {
        recordStrings() {
            return this.records.map((r) => {
                const { MaDocGia, MaSach, NgayMuon, NgayTra } = r;
                return [MaDocGia, MaSach, NgayMuon, NgayTra || ''].join('');
            });
        },
        filteredRecords() {
            if (!this.searchText) return this.records;
            return this.records.filter((_r, i) =>
                this.recordStrings[i].toLowerCase().includes(this.searchText.toLowerCase())
            );
        },
        activeRecord() {
            if (this.activeIndex < 0) return null;
            return this.filteredRecords[this.activeIndex];
        },
        filteredRecordsCount() {
            return this.filteredRecords.length;
        },
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    methods: {
        async retrieveRecords() {
            try {
                this.records = await TheoDoiMuonSachService.getAll();
            } catch (err) {
                console.error(err);
            }
        },
        refreshList() {
            this.retrieveRecords();
            this.activeIndex = -1;
        },
        async removeAll() {
            if (confirm('Bạn có chắc muốn xóa tất cả bản ghi mượn sách?')) {
                try {
                    await TheoDoiMuonSachService.deleteAll();
                    this.refreshList();
                } catch (err) {
                    console.error(err);
                }
            }
        },
        goToAdd() {
            this.$router.push({ name: 'muon.add' });
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
