<!-- Trang quản lý sách -->
<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>

        <div class="mt-3 col-md-6">
            <h4>
                Danh sách Sách
                <i class="fas fa-book"></i>
            </h4>
            <List v-if="filteredBooksCount > 0" :items="filteredBooks" v-model:activeIndex="activeIndex" />
            <p v-else>Không có sách nào.</p>

            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddBook">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllBooks">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>

        <div class="mt-3 col-md-6">
            <div v-if="activeBook">
                <h4>
                    Chi tiết Sách
                    <i class="fas fa-info-circle"></i>
                </h4>
                <EntityCard :data="activeBook" type="book" />
                <router-link :to="{ name: 'book.edit', params: { id: activeBook._id } }">
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
import BookService from '@/services/book.service.js';

export default {
    components: {
        InputSearch,
        List,
        EntityCard,
    },
    data() {
        return {
            books: [],
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
        bookStrings() {
            return this.books.map((book) => {
                const { MaSach, TenSach, MaNXB, NguonGoc } = book;
                return [MaSach, TenSach, MaNXB, NguonGoc].join('');
            });
        },
        filteredBooks() {
            if (!this.searchText) return this.books;
            return this.books.filter((_book, index) =>
                this.bookStrings[index].toLowerCase().includes(this.searchText.toLowerCase())
            );
        },
        activeBook() {
            if (this.activeIndex < 0) return null;
            return this.filteredBooks[this.activeIndex];
        },
        filteredBooksCount() {
            return this.filteredBooks.length;
        },
    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveBooks();
            this.activeIndex = -1;
        },
        async removeAllBooks() {
            if (confirm('Bạn muốn xóa tất cả sách?')) {
                try {
                    await BookService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddBook() {
            this.$router.push({ name: 'book.add' });
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
