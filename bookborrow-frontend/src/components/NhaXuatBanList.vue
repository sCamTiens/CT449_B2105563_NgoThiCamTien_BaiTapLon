<script>
export default {
    props: {
        nhaxuatbans: { type: Array, default: () => [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ['update:activeIndex'],
    methods: {
        updateActiveIndex(index) {
            this.$emit('update:activeIndex', index);
        }
    }
};
</script>

<template>
    <div class="table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th class="text-center"><strong>Tên nhà xuất bản</strong></th>
                    <th class="text-center"><strong>Số lượng sách</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(nhaxuatban, index) in nhaxuatbans" :key="nhaxuatban._id" @click="updateActiveIndex(index)">
                    <td>{{ nhaxuatban.TenNXB }}</td>
                    <td class="text-center">{{ nhaxuatban.booksCount }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>