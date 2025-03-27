<template>
    <Form @submit="submitMuonSach" :validation-schema="muonSachSchema">
        <div class="form-group">
            <label for="MaDocGia">Độc giả</label>
            <Field as="select" name="MaDocGia" class="form-control" v-model="muonLocal.MaDocGia">
                <option value="">-- Chọn độc giả --</option>
                <option v-for="docgia in danhSachDocGia" :key="docgia.MaDocGia" :value="docgia.MaDocGia">
                    {{ docgia.HoLot }} {{ docgia.Ten }}
                </option>
            </Field>
            <ErrorMessage name="MaDocGia" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="MaSach">Sách</label>
            <Field as="select" name="MaSach" class="form-control" v-model="muonLocal.MaSach">
                <option value="">-- Chọn sách --</option>
                <option v-for="book in danhSachSach" :key="book.MaSach" :value="book.MaSach">
                    {{ book.TenSach }}
                </option>
            </Field>
            <ErrorMessage name="MaSach" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="NgayMuon">Ngày mượn</label>
            <Field name="NgayMuon" type="date" class="form-control" v-model="muonLocal.NgayMuon" disabled />
            <ErrorMessage name="NgayMuon" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="NgayTra">Ngày trả</label>
            <Field name="NgayTra" type="date" class="form-control" v-model="muonLocal.NgayTra" />
            <ErrorMessage name="NgayTra" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="TrangThai">Trạng Thái</label>
            <Field as="select" name="TrangThai" class="form-control" v-model="muonLocal.TrangThai">
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
            </Field>
            <ErrorMessage name="TrangThai" class="error-feedback" />
        </div>

        <!-- Số lượng mượn -->
        <div class="form-group">
            <label for="SoLuong">Số lượng</label>
            <Field name="SoLuong" type="number" class="form-control" v-model="muonLocal.SoLuong" min="1"
                @change="checkQuantity" />
            <ErrorMessage name="SoLuong" class="error-feedback" />
        </div>

        <div class="form-group d-flex justify-content-center mb-3">
            <button class="btn btn-primary">Lưu</button>
            <!-- <button v-if="muonLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteMuonSach">
                Xóa
            </button> -->
        </div>
    </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import axios from "axios";

export default {
    components: { Form, Field, ErrorMessage },
    emits: ["submit:muonsach", "delete:muonsach"],
    props: {
        muonsach: { type: Object, required: true }
    },
    data() {
        const muonSachSchema = yup.object().shape({
            MaDocGia: yup.string().required("Vui lòng chọn độc giả."),
            MaSach: yup.string().required("Vui lòng chọn sách."),
            NgayMuon: yup.date().required("Ngày mượn là bắt buộc."),
            NgayTra: yup
                .date()
                .nullable()
                .min(yup.ref("NgayMuon"), "Ngày trả không được nhỏ hơn ngày mượn."),
            SoLuong: yup
                .number()
                .min(1, "Số lượng phải lớn hơn 0.")
                .required("Vui lòng nhập số lượng.")
        });

        return {
            muonLocal: { ...this.muonsach },
            muonSachSchema,
            danhSachDocGia: [],
            danhSachSach: [],
            oldQuantity: 0 // Số lượng sách cũ
        };
    },
    created() {
        this.fetchDocGia();
        this.fetchSach();
        // Gọi hàm để lấy số lượng sách cũ khi người dùng vào trang
        this.getOldQuantityById(this.muonLocal._id);

        const today = new Date();
        const yyyyMMdd = today.toISOString().slice(0, 10);
        const defaultReturnDate = new Date(today);
        defaultReturnDate.setDate(today.getDate() + 7);
        const yyyyMMddReturn = defaultReturnDate.toISOString().slice(0, 10);

        // Gán ngày mượn mặc định là hôm nay
        if (!this.muonLocal.NgayMuon) {
            this.muonLocal.NgayMuon = yyyyMMdd;
        }

        // Gán ngày trả mặc định là 7 ngày sau nếu chưa có
        if (!this.muonLocal.NgayTra) {
            this.muonLocal.NgayTra = yyyyMMddReturn;
        }

        // Trạng thái mặc định
        if (!this.muonLocal.TrangThai) {
            this.muonLocal.TrangThai = 'Đang mượn';  // Trạng thái mặc định khi tạo mới
        }

        // Số lượng mặc định
        if (!this.muonLocal.SoLuong) {
            this.muonLocal.SoLuong = 1;  // Mặc định số lượng là 1 khi tạo mới
        }
    },
    methods: {
        submitMuonSach() {
            this.$emit("submit:muonsach", this.muonLocal);
            this.updateBookQuantity();
        },
        deleteMuonSach() {
            this.$emit("delete:muonsach", this.muonLocal);
        },
        async fetchDocGia() {
            try {
                const res = await axios.get("/api/docgias");
                this.danhSachDocGia = res.data;
            } catch (err) {
                console.error("Lỗi tải đọc giả:", err);
            }
        },
        async fetchSach() {
            try {
                const res = await axios.get("/api/books");
                this.danhSachSach = res.data;
            } catch (err) {
                console.error("Lỗi tải sách:", err);
            }
        },
        // Hàm lấy số lượng sách cũ từ API
        async getOldQuantityById(id) {
            try {
                // Lấy thông tin số lượng sách từ API
                const response = await axios.get(`/api/muonsachs/count/${id}`);
                this.oldQuantity = response.data.SoLuong; // Lưu số lượng sách cũ vào data
                // Trả về số lượng sách mượn từ phản hồi
                return response.data.SoLuong;
            } catch (error) {
                console.error("Lỗi khi lấy số lượng sách cũ:", error);
                throw new Error("Có lỗi khi lấy số lượng sách cũ.");
            }
        },

        // Kiểm tra số lượng sách khi người dùng thay đổi
        async checkQuantity() {
            const book = this.danhSachSach.find(sach => sach.MaSach === this.muonLocal.MaSach);
            if (book) {
                const newQuantity = this.muonLocal.SoLuong;

                // Kiểm tra số lượng sách trong kho
                if (newQuantity > book.SoQuyen) {
                    alert("Số lượng sách trong kho không đủ");
                    this.muonLocal.SoLuong = this.oldQuantity; // Khôi phục lại số lượng cũ nếu vượt quá
                    return;
                } else if (newQuantity > 10) {
                    alert("Bạn không thể mượn sách quá 10 quyển");
                    this.muonLocal.SoLuong = this.oldQuantity; // Khôi phục lại số lượng cũ nếu vượt quá
                    return;
                }

                console.log(`Số lượng sách mượn cũ: ${this.oldQuantity}`);
                console.log(`Số lượng sách mượn mới: ${newQuantity}`);
            }
        },

        // Cập nhật số lượng sách trong kho
        async updateBookQuantity() {
            const book = this.danhSachSach.find(sach => sach.MaSach === this.muonLocal.MaSach);

            if (book) {
                try {
                    const newQuantity = this.muonLocal.SoLuong; // Số lượng người dùng nhập vào
                    if (newQuantity > book.SoQuyen) {
                        alert("Số lượng sách trong kho không đủ");
                        return;
                    } else if (newQuantity > 11) {
                        alert("Bạn không thể mượn sách quá 10 quyển");
                        return;
                    }

                    // Tính toán sự thay đổi số lượng sách
                    const quantityDifference = newQuantity - this.oldQuantity; // Sự thay đổi (số lượng mới - số lượng cũ)
                    console.log(`Sự thay đổi số lượng: ${quantityDifference}`);

                    // Nếu sự thay đổi số lượng sách > 0 (tăng số lượng mượn), ta sẽ trừ số lượng sách trong kho
                    if (quantityDifference > 0) {
                        const SoQuyen = book.SoQuyen - quantityDifference;
                        console.log(`Cập nhật giảm số lượng sách trong kho: ${SoQuyen}`);
                        await axios.put(`/api/muonsachs/books/updateQuantity/${book.MaSach}`, {
                            SoQuyen
                        });
                    }
                    // Nếu sự thay đổi số lượng sách < 0 (giảm số lượng mượn), ta sẽ cộng số lượng sách vào kho
                    else if (quantityDifference < 0) {
                        const SoQuyen = book.SoQuyen - quantityDifference; // Cộng lại số lượng sách
                        console.log(`Cập nhật tăng số lượng sách trong kho: ${SoQuyen}`);
                        await axios.put(`/api/muonsachs/books/updateQuantity/${book.MaSach}`, {
                            SoQuyen
                        });
                    }

                    // Hiển thị thông báo thành công
                    console.log("Số lượng sách đã được cập nhật thành công.");
                    alert("Số lượng sách đã được cập nhật thành công.");
                } catch (error) {
                    console.error("Lỗi khi cập nhật số lượng sách trong kho:", error);
                    alert("Có lỗi xảy ra khi cập nhật số lượng sách.");
                }
            } else {
                console.error("Không tìm thấy sách với mã: ", this.muonLocal.MaSach);
                alert("Không tìm thấy sách với mã " + this.muonLocal.MaSach);
            }
        }
    }
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
