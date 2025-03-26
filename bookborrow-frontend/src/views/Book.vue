<template>
    <div class="page">
        <div class="mt-3">
            <div class="d-flex justify-content-center mb-3">
                <h4 class="fw-bold">DANH SÁCH SÁCH</h4>
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
                    <BookList v-if="filteredBookCount > 0" :books="filteredBooks" :activeIndex="activeIndex"
                        @update:activeIndex="(index) => { activeIndex = index; showBookModal(index); }" />
                    <p v-else>Không có sách nào.</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="bookDetailModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-custom">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title mx-auto fw-bold">Chi tiết Sách</h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Đóng"></button>
                </div>
                <div class="modal-body">
                    <BookCard v-if="activeBook" :data="activeBook" />
                </div>
                <div class="modal-footer">
                    <button v-if="activeBook && activeBook._id" class="btn btn-warning" @click="goToEditBook">
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
import BookList from '@/components/BookList.vue';
import BookCard from "@/components/BookCard.vue";
import BookService from "@/services/book.service.js";
import axios from "axios";
import * as bootstrap from 'bootstrap';

export default {
    components: {
        InputSearch,
        BookList,
        BookCard,
    },
    data() {
        return {
            books: [],
            activeIndex: -1,
            searchText: "",
            bookModalInstance: null, // Thêm dòng này
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        bookStrings() {
            return this.books.map((book) => {
                const { MaSach, TenSach, MaNXB, TacGia } = book;
                return [MaSach, TenSach, MaNXB, TacGia].join('');
            });
        },
        filteredBooks() {
            if (!this.searchText) return this.books;
            return this.books.filter((_book, index) =>
                this.bookStrings[index]
                    .toLowerCase()
                    .includes(this.searchText.toLowerCase())
            );
        },
        activeBook() {
            if (this.activeIndex < 0) return null;
            return this.filteredBooks[this.activeIndex];
        },
        filteredBookCount() {
            return this.filteredBooks.length;
        },
    },
    methods: {
        async retrieveBook() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveBook();
            this.activeIndex = -1;
        },
        async removeAll() {
            const confirmed = confirm("Bạn muốn xóa tất cả Sách?");
            if (!confirmed) return;

            try {
                for (const book of this.books) {
                    const res = await axios.get(`/api/muonsachs/check-book/${book.MaSach}`);
                    if (res.data.exists) {
                        alert(`Không thể xóa! Sách "${book.TenSach}" đang thuộc bản ghi mượn sách.`);
                        return;
                    }
                }

                await BookService.deleteAll();
                this.refreshList();
            } catch (error) {
                console.error("Lỗi khi kiểm tra sách trước khi xóa:", error);
            }
        },
        goToAdd() {
            this.$router.push({ name: "book.add" });
        },
        showBookModal(index) {
            this.activeIndex = index;

            const modalEl = document.getElementById("bookDetailModal");
            if (modalEl) {
                if (!this.bookModalInstance) {
                    this.bookModalInstance = new bootstrap.Modal(modalEl);
                }
                this.bookModalInstance.show();
            }
        },
        goToEditBook() {
            if (this.bookModalInstance) {
                this.bookModalInstance.hide(); // Đóng modal
            }

            // Chuyển đến trang chỉnh sửa
            this.$router.push({ name: "book.edit", params: { id: this.activeBook._id } });
        },
        closeModal() {
            if (this.bookModalInstance) {
                this.bookModalInstance.hide();
            }
        }
    },
    mounted() {
        this.refreshList();
    },
};
</script>
