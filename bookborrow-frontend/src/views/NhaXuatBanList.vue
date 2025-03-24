<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>

        <div class="mt-3 col-md-6">
            <h4>
                Danh sách Nhà xuất bản
                <i class="fas fa-building"></i>
            </h4>
            <List v-if="filteredNXBCount > 0" :items="filteredNXBs" v-model:activeIndex="activeIndex" />
            <p v-else>Không có nhà xuất bản nào.</p>

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
            <div v-if="activeNXB">
                <h4>
                    Chi tiết Nhà xuất bản
                    <i class="fas fa-info-circle"></i>
                </h4>
                <EntityCard :data="activeNXB" type="nxb" />
                <router-link :to="{ name: 'nxb.edit', params: { id: activeNXB._id } }">
                    <span class="mt-2 badge badge-warning">
                        <i class="fas fa-edit"></i> Hiệu chỉnh
                    </span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import List from "@/components/List.vue";
import EntityCard from "@/components/EntityCard.vue";
import NhaXuatBanService from "@/services/nhaxuatban.service.js";

export default {
    components: {
        InputSearch,
        List,
        EntityCard,
    },
    data() {
        return {
            nxbList: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        nxbStrings() {
            return this.nxbList.map((nxb) => {
                const { MaNXB, TenNXB, DiaChi } = nxb;
                return [MaNXB, TenNXB, DiaChi].join("");
            });
        },
        filteredNXBs() {
            if (!this.searchText) return this.nxbList;
            return this.nxbList.filter((_nxb, index) =>
                this.nxbStrings[index]
                    .toLowerCase()
                    .includes(this.searchText.toLowerCase())
            );
        },
        activeNXB() {
            if (this.activeIndex < 0) return null;
            return this.filteredNXBs[this.activeIndex];
        },
        filteredNXBCount() {
            return this.filteredNXBs.length;
        },
    },
    methods: {
        async retrieveNXB() {
            try {
                this.nxbList = await NhaXuatBanService.getAll();
            } catch (error) {
                console.error(error);
            }
        },
        refreshList() {
            this.retrieveNXB();
            this.activeIndex = -1;
        },
        async removeAll() {
            if (confirm("Bạn muốn xóa tất cả nhà xuất bản?")) {
                try {
                    await NhaXuatBanService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.error(error);
                }
            }
        },
        goToAdd() {
            this.$router.push({ name: "nxb.add" });
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
