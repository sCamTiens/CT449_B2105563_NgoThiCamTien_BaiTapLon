<script>
export default {
    props: {
        books: { type: Array, default: () => [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        },
    },
};
</script>

<template>
    <div class="container mt-3">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th class="text-center"><strong>Tên sách</strong></th>
                    <th class="text-center"><strong>Số lượng còn lại</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in books" :key="book._id" @click="updateActiveIndex(index)">
                    <td>{{ book.TenSach }}</td>
                    <td class="text-center">{{ book.SoQuyen }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.list-group-item {
    font-size: 1.1rem;
    padding: 12px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.list-group-item:hover {
    background-color: #f0f0f0;
}

.list-group-item.active {
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
}
</style>
