<template>
    <Form @submit="submitMuonSach" :validation-schema="muonSachSchema">
        <div class="form-group">
            <label for="MaDocGia">Đọc giả</label>
            <Field as="select" name="MaDocGia" class="form-control" v-model="muonLocal.MaDocGia">
                <option value="">-- Chọn đọc giả --</option>
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

        <!-- Hiển thị trạng thái đã trả / chưa trả -->
        <!-- <div class="form-group">
            <label>Trạng thái:</label>
            <span class="badge" :class="muonLocal.NgayTra ? 'bg-success' : 'bg-warning'">
                {{ muonLocal.NgayTra ? "Đã trả" : "Chưa trả" }}
            </span>
        </div> -->

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="muonLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteMuonSach">
                Xóa
            </button>
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
        });

        return {
            muonLocal: { ...this.muonsach },
            muonSachSchema,
            danhSachDocGia: [],
            danhSachSach: []
        };
    },
    created() {
        this.fetchDocGia();
        this.fetchSach();

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
    },
    methods: {
        submitMuonSach() {
            this.$emit("submit:muonsach", this.muonLocal);
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
    },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
