<template>
    <div v-if="book" class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">HIỆU CHỈNH SÁCH</h4>
        </div>
        <BookForm :book="book" @submit:book="updateBook" @delete:book="deleteBook" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import BookForm from '@/components/BookForm.vue';
import BookService from '@/services/book.service';

export default {
    components: {
        BookForm,
    },
    props: {
        id: { type: String, required: true },
    },

    data() {
        return {
            book: null,
            message: '',
        };
    },
    methods: {
        async getBook(id) {
            try {
                this.book = (await BookService.get(id))[0] || null;
            } catch (error) {
                console.log(error);
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                this.$router.push({
                    name: 'notfound',
                    params: {
                        pathMatch: this.$route.path.split('/').slice(1)
                    },
                    query: this.$route.query,
                    hash: this.$route.hash
                });
            }
        },
        async updateBook(data) {
            try {
                await BookService.update(this.book._id, data);
                confirm("Sách được cập nhật thành công");
                this.$router.push({ name: 'book' });
            } catch (error) {
                console.log(error);
                this.message = 'Lỗi khi cập nhật Sách';
            }
        },

        async deleteBook() {
            try {
                await BookService.delete(this.book._id);
                confirm("Sách được xóa thành công");
                this.$router.push({ name: 'book' });
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        this.getBook(this.id);
        this.message = '';
    },
};
</script>