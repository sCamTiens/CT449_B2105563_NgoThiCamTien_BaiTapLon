<template>
    <div class="page">
        <h4>Thêm Sách Mới</h4>
        <BookForm :book="book" @submit:book="createBook" />
        <p>{{ message }}</p>
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
        resetForm() {
            // Reset the form after successful submission
            this.book = {
                TenSach: "",
                DonGia: null,
                SoQuyen: null,
                NamXuatBan: null,
                MaNXB: "",
                TacGia: "",
            };
        }
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
