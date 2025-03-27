<template>
    <div class="table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th class="text-center"><strong>Độc Giả</strong></th>
                    <th class="text-center"><strong>Sách</strong></th>
                    <th class="text-center"><strong>Số Lượng</strong></th>
                    <th class="text-center"><strong>Trạng Thái</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(muonsach, index) in muonsachs" :key="muonsach._id" @click="updateActiveIndex(index)"
                    :class="{ 'table-danger': isOverdue(muonsach) }">
                    <td>{{ muonsach.TenDocGia }}</td>
                    <td>{{ muonsach.TenSach }}</td>
                    <td class="text-center">{{ muonsach.SoLuong }}</td>
                    <td class="text-center">{{ muonsach.TrangThai }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        muonsachs: { type: Array, default: () => [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ['update:activeIndex'],
    methods: {
        updateActiveIndex(index) {
            this.$emit('update:activeIndex', index);
        },
        // Kiểm tra xem bản ghi có quá hạn không
        isOverdue(muonsach) {
            const currentDate = new Date();
            const returnDate = new Date(muonsach.NgayTra);

            // Kiểm tra nếu NgàyTra nhỏ hơn ngày hiện tại và trạng thái là "Đang mượn"
            return muonsach.TrangThai === "Đang mượn" && returnDate < currentDate;
        }
    }
};
</script>

<style scoped>
.table-danger {
    background-color: #f8d7da !important;
    /* Màu đỏ cho các bản ghi quá hạn */
}
</style>
