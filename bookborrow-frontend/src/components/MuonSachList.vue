<template>
    <div class="table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th class="text-center"><strong>Độc Giả</strong></th>
                    <th class="text-center"><strong>Sách</strong></th>
                    <th class="text-center"><strong>Số Lượng</strong></th>
                    <th class="text-center"><strong>Trạng Thái</strong></th>
                    <th class="text-center"><strong>Hành Động</strong></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(muonsach, index) in muonsachs" :key="muonsach._id" @click="updateActiveIndex(index)"
                    :class="{ 'table-danger': isOverdue(muonsach) }">
                    <td>{{ muonsach.TenDocGia }}</td>
                    <td>{{ muonsach.TenSach }}</td>
                    <td class="text-center">{{ muonsach.SoLuong }}</td>
                    <td class="text-center">{{ muonsach.TrangThai }}</td>
                    <td class="text-center">
                        <!-- Nút trả sách nếu sách đang mượn -->
                        <button v-if="muonsach.TrangThai === 'Đang mượn'" @click.stop="returnBook(muonsach)"
                            class="btn btn-success">Trả sách</button>
                        <!-- Hiển thị trạng thái "Đã trả" nếu đã trả -->
                        <span v-if="muonsach.TrangThai === 'Đã trả'" class="text-success">Đã trả</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
import TheoDoiMuonSachService from "@/services/theoDoiMuonSach.service";

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
        },

        async returnBook(muonsach) {
            try {
                // Lấy ngày trả sách là ngày hiện tại
                const today = new Date().toISOString().slice(0, 10);

                // Gọi phương thức returnBook từ service
                await TheoDoiMuonSachService.returnBook(muonsach._id, today);

                // Cập nhật trạng thái sách
                muonsach.TrangThai = "Đã trả";
                muonsach.NgayTra = today;

                // Cập nhật số lượng sách trong kho
                const book = await TheoDoiMuonSachService.getBookDetails(muonsach.MaSach);
                if (book) {
                    await TheoDoiMuonSachService.updateBookQuantity(muonsach.MaSach, book.SoQuyen + muonsach.SoLuong);
                }

                alert("Sách đã được trả thành công!");
            } catch (error) {
                console.error("Lỗi khi trả sách:", error);
                alert("Có lỗi xảy ra khi trả sách.");
            }
        },
    }
};
</script>

<style scoped>
.table-danger {
    background-color: #f8d7da !important;
    /* Màu đỏ cho các bản ghi quá hạn */
}
</style>
