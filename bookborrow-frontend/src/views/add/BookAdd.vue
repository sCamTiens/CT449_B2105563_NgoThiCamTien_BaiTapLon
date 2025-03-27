<template>
    <div class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">THÊM MỚI SÁCH</h4>
        </div>
        <BookForm :book="book" @submit:book="createBook" />
        <p class="text-center">{{ message }}</p>
    </div>
</template>

<script>
import BookForm from '@/components/BookForm.vue';  // Import BookForm component
import BookService from '@/services/book.service';  // Import BookService to handle book-related API calls

export default {
    components: {
        BookForm,
    },
    data() {
        return {
            book: {
                TenSach: "",
                DonGia: null,
                SoQuyen: null,
                NamXuatBan: null,
                MaNXB: "",
                TacGia: "",
            },
            message: '',
        };
    },
    methods: {
        async createBook(data) {
            try {
                // Call BookService to create a new book
                await BookService.create(data);
                confirm("Sách được thêm thành công");
                this.$router.push({ name: 'book' });
            } catch (error) {
                console.log(error);
                this.message = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            }
        },
    },
    created() {
        this.message = '';
    },
};
</script>

<style scoped>
.page {
    text-align: left;
    max-width: 100%;
}
</style>
