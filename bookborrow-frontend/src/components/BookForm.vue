<template>
    <Form @submit="submitBook" :validation-schema="bookSchema">
        <div class="form-group">
            <label for="TenSach">Tên sách</label>
            <Field name="TenSach" type="text" class="form-control" v-model="bookLocal.TenSach" />
            <ErrorMessage name="TenSach" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="DonGia">Đơn giá</label>
            <Field name="DonGia" type="number" class="form-control" v-model="bookLocal.DonGia" />
            <ErrorMessage name="DonGia" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="SoQuyen">Số quyển</label>
            <Field name="SoQuyen" type="number" class="form-control" v-model="bookLocal.SoQuyen" />
            <ErrorMessage name="SoQuyen" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="NamXuatBan">Năm xuất bản</label>
            <Field name="NamXuatBan" type="number" class="form-control" v-model="bookLocal.NamXuatBan" />
            <ErrorMessage name="NamXuatBan" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="MaNXB">Nhà xuất bản</label>
            <Field as="select" name="MaNXB" class="form-control" v-model="bookLocal.MaNXB">
                <option value="">-- Chọn nhà xuất bản --</option>
                <option v-for="nxb in danhSachNXB" :key="nxb.MaNXB" :value="nxb.MaNXB">
                    {{ nxb.TenNXB }}
                </option>
            </Field>
            <ErrorMessage name="MaNXB" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="TacGia">Tác giả</label>
            <Field name="TacGia" type="text" class="form-control" v-model="bookLocal.TacGia" />
            <ErrorMessage name="TacGia" class="error-feedback" />
        </div>
        <div class="form-group d-flex justify-content-center mb-3">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="bookLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteBook">
                Xóa
            </button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";

export default {
    components: { Form, Field, ErrorMessage },
    emits: ["submit:book", "delete:book"],
    props: {
        book: { type: Object, required: true }
    },
    data() {
        const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
        const bookSchema = yup.object().shape({
            TenSach: yup.string().required("Tên sách là bắt buộc."),

            DonGia: yup
                .number()
                .typeError("Phải là số")
                .min(0, "Đơn giá không được âm")
                .required("Đơn giá là bắt buộc."),

            SoQuyen: yup
                .number()
                .typeError("Phải là số")
                .min(1, "Số quyển không được âm và phải lớn hơn 0")
                .required("Số quyển là bắt buộc."),

            NamXuatBan: yup
                .number()
                .typeError("Phải là số")
                .min(0, "Năm xuất bản không được âm")
                .max(currentYear, `Năm xuất bản không được lớn hơn ${currentYear}`)
                .required("Năm xuất bản là bắt buộc."),

            MaNXB: yup.string().required("Vui lòng chọn nhà xuất bản."),

            TacGia: yup.string().max(100, "Tác giả tối đa 100 ký tự."),
        });

        return {
            bookLocal: this.book,
            bookSchema,
            danhSachNXB: [] // danh sách NXB để hiển thị
        };
    },
    created() {
        this.fetchNhaXuatBan();
    },
    methods: {
        async fetchNhaXuatBan() {
            try {
                const res = await axios.get("/api/books/publishers");
                this.danhSachNXB = res.data;
            } catch (err) {
                console.error("Lỗi khi lấy danh sách nhà xuất bản:", err);
            }
        },
        submitBook() {
            this.$emit("submit:book", this.bookLocal);
        },
        async deleteBook() {
            try {
                // Gọi API kiểm tra xem sách có đang được mượn không
                const res = await axios.get(`/api/muonsachs/check-book/${this.bookLocal.MaSach}`);
                if (res.data.exists) {
                    alert("Không thể xóa! Sách đang thuộc bản ghi mượn sách.");
                    return;
                }

                // Nếu không bị mượn thì xác nhận xóa
                const confirmed = confirm("Bạn có chắc chắn muốn xóa sách này?");
                if (confirmed) {
                    this.$emit("delete:book", this.bookLocal);
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra sách trong bản ghi mượn:", error);
                alert("Đã xảy ra lỗi khi kiểm tra sách trước khi xóa.");
            }
        },
    },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
