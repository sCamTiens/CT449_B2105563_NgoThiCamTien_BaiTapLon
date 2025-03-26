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
    <ul class="list-group">
        <li v-for="(book, index) in books" :key="book._id" class="list-group-item"
            :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
            {{ book.TenSach }}
        </li>
    </ul>
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
