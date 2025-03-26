<template>
    <div class="page">
        <div class="mt-3">
            <div class="d-flex justify-content-center mb-3">
                <h4 class="fw-bold">DANH SÁCH NHÂN VIÊN</h4>
            </div>

            <div class="d-flex justify-content-center">
                <div style="width: 800px;">
                    <div class="row align-items-center mb-3">
                        <!-- Cột nút bên trái -->
                        <div class="col-md-8 d-flex gap-2 add">
                            <button class="btn btn-sm" @click="refreshList()">
                                <font-awesome-icon icon="redo" /> Làm mới
                            </button>
                            <button class="btn btn-sm" @click="goToAddNhanVien">
                                <i class="fas fa-plus"></i> Thêm mới
                            </button>
                            <button class="btn btn-sm" @click="removeAllNhanVien">
                                <font-awesome-icon icon="trash" /> Xóa tất cả
                            </button>
                        </div>

                        <!-- Cột search bên phải -->
                        <div class="col-md-4">
                            <InputSearch v-model="searchText" />
                        </div>
                    </div>

                    <!-- Danh sách nhân viên -->
                    <NhanVienList v-if="filteredNhanVienCount > 0" :nhanviens="filteredNhanViens"
                        :activeIndex="activeIndex"
                        @update:activeIndex="(index) => { activeIndex = index; showNhanVienModal(index); }" />
                    <p v-else>Không có nhân viên nào.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal chi tiết nhân viên -->
    <div class="modal fade" id="nhanvienDetailModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-custom">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title mx-auto fw-bold">Chi tiết Nhân viên</h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Đóng"></button>
                </div>
                <div class="modal-body">
                    <NhanVienCard v-if="activeNhanVien" :data="activeNhanVien" />
                </div>
                <div class="modal-footer">
                    <button v-if="activeNhanVien && activeNhanVien._id" class="btn btn-warning"
                        @click="goToEditNhanVien">
                        Hiệu chỉnh
                    </button>
                    <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';
import NhanVienList from '@/components/NhanVienList.vue';
import NhanVienCard from '@/components/NhanVienCard.vue';
import NhanVienService from '@/services/nhanVien.service.js';
import * as bootstrap from 'bootstrap';

export default {
    components: {
        InputSearch,
        NhanVienList,
        NhanVienCard,
    },
    data() {
        return {
            nhanviens: [],
            activeIndex: -1,
            searchText: '',
            nhanvienModalInstance: null,
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
        filteredNhanViens() {
            if (!this.searchText) return this.nhanviens;
            return this.nhanviens.filter((_nv, index) =>
                this.nhanvienStrings[index].toLowerCase().includes(this.searchText.toLowerCase())
            );
        },
        activeNhanVien() {
            if (this.activeIndex < 0) return null;
            return this.filteredNhanViens[this.activeIndex];
        },
        filteredNhanVienCount() {
            return this.filteredNhanViens.length;
        },
    },
    methods: {
        async retrieveNhanVien() {
            try {
                this.nhanviens = await NhanVienService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveNhanVien();
            this.activeIndex = -1;
        },
        async removeAllNhanVien() {
            const confirmed = confirm('Bạn muốn xóa tất cả nhân viên?');
            if (!confirmed) return;
            try {
                await NhanVienService.deleteAll();
                this.refreshList();
            } catch (error) {
                console.log(error);
            }
        },
        goToAddNhanVien() {
            this.$router.push({ name: 'nhanvien.add' });
        },
        showNhanVienModal(index) {
            this.activeIndex = index;
            const modalEl = document.getElementById("nhanvienDetailModal");
            if (modalEl) {
                if (!this.nhanvienModalInstance) {
                    this.nhanvienModalInstance = new bootstrap.Modal(modalEl);
                }
                this.nhanvienModalInstance.show();
            }
        },
        goToEditNhanVien() {
            if (this.nhanvienModalInstance) this.nhanvienModalInstance.hide();
            this.$router.push({ name: 'nhanvien.edit', params: { id: this.activeNhanVien._id } });
        },
        closeModal() {
            if (this.nhanvienModalInstance) this.nhanvienModalInstance.hide();
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>
