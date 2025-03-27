<template>
    <div class="page">
        <div class="mt-3">
            <div class="d-flex justify-content-center mb-3">
                <h4 class="fw-bold">DANH SÁCH NHÀ XUẤT BẢN</h4>
            </div>

            <div class="d-flex justify-content-center">
                <div style="width: 900px;">
                    <div class="row align-items-center mb-3">
                        <!-- Cột nút bên trái -->
                        <div class="col-md-8 d-flex gap-2 add">
                            <button class="btn btn-sm" @click="refreshList()">
                                <font-awesome-icon icon="redo" /> Làm mới
                            </button>
                            <button class="btn btn-sm" @click="goToAdd">
                                <i class="fas fa-plus"></i> Thêm mới
                            </button>
                            <button class="btn btn-sm" @click="removeAll">
                                <font-awesome-icon icon="trash" /> Xóa tất cả
                            </button>
                        </div>

                        <!-- Cột search bên phải -->
                        <div class="col-md-4">
                            <InputSearch v-model="searchText" />
                        </div>
                    </div>

                    <!-- Danh sách -->
                    <NhaXuatBanList v-if="filteredNXBCount > 0" :nhaxuatbans="filteredNXBs" :activeIndex="activeIndex"
                        @update:activeIndex="(index) => { activeIndex = index; showNXBModal(index); }" />
                    <p v-else>Không có nhà xuất bản nào.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal chi tiết NXB -->
    <div class="modal fade" id="nxbDetailModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-custom">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title mx-auto fw-bold">Chi tiết Nhà xuất bản</h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Đóng"></button>
                </div>
                <div class="modal-body">
                    <NhaXuatBanCard v-if="activeNXB" :data="activeNXB" />
                </div>
                <div class="modal-footer">
                    <button v-if="activeNXB && activeNXB._id" class="btn btn-warning" @click="goToEditNXB">
                        Hiệu chỉnh
                    </button>
                    <button type="button" class="btn btn-secondary" @click="closeModal">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import NhaXuatBanList from "@/components/NhaXuatBanList.vue";
import NhaXuatBanCard from "@/components/NhaXuatBanCard.vue";
import NhaXuatBanService from "@/services/nhaXuatBan.service.js";
import axios from "axios";
import * as bootstrap from "bootstrap";

export default {
    components: {
        InputSearch,
        NhaXuatBanList,
        NhaXuatBanCard,
    },
    data() {
        return {
            nhaxuatbans: [],
            activeIndex: -1,
            searchText: "",
            nxbModalInstance: null,
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        nxbStrings() {
            return this.nhaxuatbans.map((nxb) => {
                const { MaNXB, TenNXB, DiaChi } = nxb;
                return [MaNXB, TenNXB, DiaChi].join("");
            });
        },
        filteredNXBs() {
            if (!this.searchText) return this.nhaxuatbans;
            return this.nhaxuatbans.filter((_nxb, index) =>
                this.nxbStrings[index].toLowerCase().includes(this.searchText.toLowerCase())
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
                // Lấy tất cả nhà xuất bản
                const nhaxuatbans = await NhaXuatBanService.getAll();

                // Duyệt qua từng nhà xuất bản và lấy số lượng sách của từng nhà xuất bản
                for (let nxb of nhaxuatbans) {
                    // Gọi API để lấy số lượng sách của nhà xuất bản
                    const res = await NhaXuatBanService.getBooksCountByPublisher(nxb.MaNXB);
                    nxb.booksCount = res.count || 0; // Thêm trường `booksCount` vào đối tượng nhà xuất bản
                }

                // Cập nhật danh sách nhà xuất bản
                this.nhaxuatbans = nhaxuatbans;
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveNXB();
            this.activeIndex = -1;
        },
        async removeAll() {
            const confirmed = confirm("Bạn muốn xóa tất cả nhà xuất bản?");
            if (!confirmed) return;

            try {
                for (const nxb of this.nhaxuatbans) {
                    const res = await axios.get(`/api/nhaxuatbans/book/${nxb.MaNXB}`);
                    if (res.data.length > 0) {
                        alert(`Không thể xóa! Nhà xuất bản "${nxb.TenNXB}" vẫn còn sách.`);
                        return;
                    }
                }

                await NhaXuatBanService.deleteAll();
                this.refreshList();
            } catch (error) {
                console.error("Lỗi khi xóa tất cả nhà xuất bản:", error);
            }
        },
        goToAdd() {
            this.$router.push({ name: "nhaxuatban.add" });
        },
        showNXBModal(index) {
            this.activeIndex = index;
            const modalEl = document.getElementById("nxbDetailModal");
            if (modalEl) {
                if (!this.nxbModalInstance) {
                    this.nxbModalInstance = new bootstrap.Modal(modalEl);
                }
                this.nxbModalInstance.show();
            }
        },
        goToEditNXB() {
            if (this.nxbModalInstance) this.nxbModalInstance.hide();
            this.$router.push({ name: "nhaxuatban.edit", params: { id: this.activeNXB._id } });
        },
        closeModal() {
            if (this.nxbModalInstance) this.nxbModalInstance.hide();
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>
