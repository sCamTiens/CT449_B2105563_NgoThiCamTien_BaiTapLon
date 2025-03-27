<template>
    <div class="page">
        <div class="mt-3">
            <div class="d-flex justify-content-center mb-3">
                <h4 class="fw-bold">DANH SÁCH ĐỘC GIẢ</h4>
            </div>

            <!-- Danh sách độc giả -->
            <div class="d-flex justify-content-center">
                <div style="width: 800px;">
                    <div class="row align-items-center mb-3">
                        <!-- Nút chức năng -->
                        <div class="col-md-8 d-flex gap-2 add">
                            <button class="btn btn-sm" @click="refreshList()">
                                <font-awesome-icon icon="redo" /> Làm mới
                            </button>
                            <button class="btn btn-sm" @click="goToAddDocGia">
                                <i class="fas fa-plus"></i> Thêm mới
                            </button>
                            <button class="btn btn-sm" @click="removeAllDocGia">
                                <font-awesome-icon icon="trash" /> Xóa tất cả
                            </button>
                        </div>

                        <!-- Ô tìm kiếm -->
                        <div class="col-md-4">
                            <InputSearch v-model="searchText" />
                        </div>
                    </div>

                    <DocGiaList v-if="filteredDocGiaCount > 0" :docgias="filteredDocGias" :activeIndex="activeIndex"
                        @update:activeIndex="(index) => { activeIndex = index; showDocGiaModal(index); }" />
                    <p v-else>Không có độc giả nào.</p>
                </div>
            </div>
        </div>

        <!-- Modal Chi tiết -->
        <div class="modal fade" id="docGiaDetailModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-custom">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title mx-auto fw-bold">Chi tiết Độc giả</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Đóng"></button>
                    </div>
                    <div class="modal-body">
                        <DocGiaCard v-if="activeDocGia" :data="activeDocGia" />
                    </div>
                    <div class="modal-footer">
                        <button v-if="activeDocGia && activeDocGia._id" class="btn btn-warning" @click="goToEditDocGia">
                            Hiệu chỉnh
                        </button>
                        <button type="button" class="btn btn-secondary" @click="closeModal">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';
import DocGiaList from '@/components/DocGiaList.vue';
import DocGiaCard from '@/components/DocGiaCard.vue';
import DocGiaService from '@/services/docGia.service.js';
import axios from "axios";
import * as bootstrap from 'bootstrap';

export default {
    components: {
        InputSearch,
        DocGiaList,
        DocGiaCard,
    },
    data() {
        return {
            docgias: [],
            activeIndex: -1,
            searchText: '',
            docGiaModalInstance: null, // Modal Bootstrap
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        docgiaStrings() {
            return this.docgias.map((docgia) => {
                const { MaDocGia, HoLot, Ten, DiaChi } = docgia;
                return [MaDocGia, HoLot, Ten, DiaChi].join('');
            });
        },
        filteredDocGias() {
            if (!this.searchText) return this.docgias;
            return this.docgias.filter((_docgia, index) =>
                this.docgiaStrings[index].toLowerCase().includes(this.searchText.toLowerCase())
            );
        },
        activeDocGia() {
            if (this.activeIndex < 0) return null;
            return this.filteredDocGias[this.activeIndex];
        },
        filteredDocGiaCount() {
            return this.filteredDocGias.length;
        },
    },
    methods: {
        async retrieveDocGia() {
            try {
                // Lấy danh sách độc giả
                this.docgias = await DocGiaService.getAll();

                // Lặp qua mỗi độc giả và đếm số lượng sách mượn
                for (let docgia of this.docgias) {
                    try {
                        // Gọi API để lấy số lượng sách đã mượn
                        const res = await DocGiaService.getBorrowedBooksCount(docgia.MaDocGia);
                        docgia.soLuongMuon = res.count || 0; // Lưu số lượng sách mượn vào từng đối tượng docgia
                    } catch (error) {
                        console.log("Lỗi khi lấy số lượng sách mượn cho độc giả:", docgia.MaDocGia, error);
                        docgia.soLuongMuon = 0; // Nếu gặp lỗi, mặc định là 0
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveDocGia();
            this.activeIndex = -1;
        },
        async removeAllDocGia() {
            const confirmed = confirm('Bạn muốn xóa tất cả độc giả?');
            if (!confirmed) return;
            try {
                for (const docgia of this.docgias) {
                    const res = await axios.get(`/api/docgias/check-borrowed/${docgia.MaDocGia}`);
                    if (res.data.hasBorrowed) {
                        alert(`Không thể xóa! Độc giả "${docgia.HoLot} ${docgia.Ten}" đang thuộc bản ghi mượn sách.`);
                        return;
                    }
                }
                await DocGiaService.deleteAll();
                this.refreshList();
            } catch (error) {
                console.log(error);
            }
        },
        goToAddDocGia() {
            this.$router.push({ name: 'docgia.add' });
        },
        showDocGiaModal(index) {
            this.activeIndex = index;
            const modalEl = document.getElementById("docGiaDetailModal");
            if (modalEl) {
                if (!this.docGiaModalInstance) {
                    this.docGiaModalInstance = new bootstrap.Modal(modalEl);
                }
                this.docGiaModalInstance.show();
            }
        },
        closeModal() {
            if (this.docGiaModalInstance) {
                this.docGiaModalInstance.hide();
            }
        },
        goToEditDocGia() {
            if (this.docGiaModalInstance) {
                this.docGiaModalInstance.hide();
            }
            this.$router.push({
                name: 'docgia.edit',
                params: { id: this.activeDocGia._id }
            });
        }
    },
    mounted() {
        this.refreshList();
    },
};
</script>
