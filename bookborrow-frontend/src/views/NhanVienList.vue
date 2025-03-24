<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>

        <div class="mt-3 col-md-6">
            <h4>
                Danh sách Nhân viên
                <i class="fas fa-user-tie"></i>
            </h4>
            <List v-if="filteredNhanVienCount > 0" :items="filteredNhanVien" v-model:activeIndex="activeIndex" />
            <p v-else>Không có nhân viên nào.</p>

            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddNhanVien">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllNhanVien">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>

        <div class="mt-3 col-md-6">
            <div v-if="activeNhanVien">
                <h4>
                    Chi tiết Nhân viên
                    <i class="fas fa-id-card"></i>
                </h4>
                <EntityCard :data="activeNhanVien" type="nhanvien" />
                <router-link :to="{ name: 'nhanvien.edit', params: { id: activeNhanVien._id } }">
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
import NhanVienService from "@/services/nhanvien.service.js";

export default {
    components: {
        InputSearch,
        List,
        EntityCard,
    },
    data() {
        return {
            nhanviens: [],
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
        nhanvienStrings() {
            return this.nhanviens.map((nv) => {
                const { MSNV, HoTenNV, ChucVu, DiaChi } = nv;
                return [MSNV, HoTenNV, ChucVu, DiaChi].join("");
            });
        },
        filteredNhanVien() {
            if (!this.searchText) return this.nhanviens;
            return this.nhanviens.filter((_nv, index) =>
                this.nhanvienStrings[index]
                    .toLowerCase()
                    .includes(this.searchText.toLowerCase())
            );
        },
        activeNhanVien() {
            if (this.activeIndex < 0) return null;
            return this.filteredNhanVien[this.activeIndex];
        },
        filteredNhanVienCount() {
            return this.filteredNhanVien.length;
        },
    },
    methods: {
        async retrieveNhanVien() {
            try {
                this.nhanviens = await NhanVienService.getAll();
            } catch (error) {
                console.error(error);
            }
        },
        refreshList() {
            this.retrieveNhanVien();
            this.activeIndex = -1;
        },
        async removeAllNhanVien() {
            if (confirm("Bạn muốn xóa tất cả nhân viên?")) {
                try {
                    await NhanVienService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.error(error);
                }
            }
        },
        goToAddNhanVien() {
            this.$router.push({ name: "nhanvien.add" });
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
