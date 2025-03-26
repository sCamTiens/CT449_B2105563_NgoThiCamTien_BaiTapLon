<template>
    <div class="page">
        <div class="mt-3">
            <div class="d-flex justify-content-center mb-3">
                <h4 class="fw-bold">DANH SÁCH MƯỢN SÁCH</h4>
            </div>

            <!-- Danh sách -->
            <div class="d-flex justify-content-center">
                <div style="width: 800px;">
                    <div class="row align-items-center mb-3">
                        <!-- Nút chức năng bên trái -->
                        <div class="col-md-8 d-flex gap-2 add">
                            <button class="btn btn-sm" @click="refreshList()">
                                <font-awesome-icon icon="redo" /> Làm mới
                            </button>
                            <button class="btn btn-sm" @click="goToAddMuonSach">
                                <i class="fas fa-plus"></i> Thêm mới
                            </button>
                            <button class="btn btn-sm" @click="removeAllMuonSach">
                                <font-awesome-icon icon="trash" /> Xóa tất cả
                            </button>
                        </div>

                        <!-- Thanh tìm kiếm bên phải -->
                        <div class="col-md-4">
                            <InputSearch v-model="searchText" />
                        </div>
                    </div>

                    <!-- Danh sách mượn sách -->
                    <MuonSachList v-if="filteredMuonSachCount > 0" :muonsachs="filteredMuonSachs"
                        :activeIndex="activeIndex"
                        @update:activeIndex="(index) => { activeIndex = index; showMuonSachModal(index); }" />
                    <p v-else>Không có bản ghi mượn sách nào.</p>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="muonSachDetailModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-custom">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title mx-auto fw-bold">Chi tiết Mượn sách</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Đóng"></button>
                    </div>
                    <div class="modal-body">
                        <MuonSachCard v-if="activeMuonSach" :data="activeMuonSach" />
                    </div>
                    <div class="modal-footer">
                        <button v-if="activeMuonSach && activeMuonSach._id" class="btn btn-warning"
                            @click="goToEditMuonSach">
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
import MuonSachList from '@/components/MuonSachList.vue';
import MuonSachCard from '@/components/MuonSachCard.vue';
import MuonSachService from '@/services/theoDoiMuonSach.service.js';
import * as bootstrap from 'bootstrap';

export default {
    components: {
        InputSearch,
        MuonSachList,
        MuonSachCard,
    },
    data() {
        return {
            muonsachs: [],
            activeIndex: -1,
            searchText: '',
            muonSachModalInstance: null, // Modal bootstrap
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        muonsachStrings() {
            return this.muonsachs.map((item) => {
                const { MaMuon, MaSach, MaDocGia, NgayMuon, NgayTra } = item;
                return [MaMuon, MaSach, MaDocGia, NgayMuon, NgayTra].join('');
            });
        },
        filteredMuonSachs() {
            if (!this.searchText) return this.muonsachs;
            return this.muonsachs.filter((_item, index) =>
                this.muonsachStrings[index].toLowerCase().includes(this.searchText.toLowerCase())
            );
        },
        activeMuonSach() {
            if (this.activeIndex < 0) return null;
            return this.filteredMuonSachs[this.activeIndex];
        },
        filteredMuonSachCount() {
            return this.filteredMuonSachs.length;
        },
    },
    methods: {
        async retrieveMuonSach() {
            try {
                this.muonsachs = await MuonSachService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveMuonSach();
            this.activeIndex = -1;
        },
        async removeAllMuonSach() {
            const confirmed = confirm('Bạn muốn xóa tất cả bản ghi?');
            if (!confirmed) return;
            try {
                await MuonSachService.deleteAll();
                this.refreshList();
            } catch (error) {
                console.log(error);
            }
        },
        goToAddMuonSach() {
            this.$router.push({ name: 'muonsach.add' });
        },
        showMuonSachModal(index) {
            this.activeIndex = index;
            const modalEl = document.getElementById("muonSachDetailModal");
            if (modalEl) {
                if (!this.muonSachModalInstance) {
                    this.muonSachModalInstance = new bootstrap.Modal(modalEl);
                }
                this.muonSachModalInstance.show();
            }
        },
        closeModal() {
            if (this.muonSachModalInstance) {
                this.muonSachModalInstance.hide();
            }
        },
        goToEditMuonSach() {
            if (this.muonSachModalInstance) {
                this.muonSachModalInstance.hide();
            }
            this.$router.push({
                name: 'muonsach.edit',
                params: { id: this.activeMuonSach._id }
            });
        }
    },
    mounted() {
        this.refreshList();
    }
};
</script>
