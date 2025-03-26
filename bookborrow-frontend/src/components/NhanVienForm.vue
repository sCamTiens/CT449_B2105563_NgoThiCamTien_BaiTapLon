<template>
    <Form @submit="submitNhanVien" :validation-schema="nhanVienSchema">
        <div class="form-group">
            <label for="HoTenNV">Họ tên</label>
            <Field name="HoTenNV" type="text" class="form-control" v-model="nvLocal.HoTenNV" />
            <ErrorMessage name="HoTenNV" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="Password">Mật khẩu</label>
            <Field name="Password" type="password" class="form-control" v-model="nvLocal.Password" />
            <ErrorMessage name="Password" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="ChucVu">Chức vụ</label>
            <Field as="select" name="ChucVu" class="form-control" v-model="nvLocal.ChucVu">
                <option value="">-- Chọn chức vụ --</option>
                <option value="Admin">Admin</option>
                <option value="Nhân Viên">Nhân Viên</option>
            </Field>
            <ErrorMessage name="ChucVu" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="DiaChi">Địa chỉ</label>
            <Field name="DiaChi" type="text" class="form-control" v-model="nvLocal.DiaChi" />
            <ErrorMessage name="DiaChi" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="SoDienThoai">Số điện thoại</label>
            <Field name="SoDienThoai" type="text" class="form-control" v-model="nvLocal.SoDienThoai" />
            <ErrorMessage name="SoDienThoai" class="error-feedback" />
        </div>

        <div class="form-group d-flex justify-content-center mb-3">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="nvLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteNhanVien">
                Xóa
            </button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: { Form, Field, ErrorMessage },
    emits: ["submit:nhanvien", "delete:nhanvien"],
    props: {
        nhanvien: { type: Object, required: true }
    },
    data() {
        const sdtRegex = /((09|03|07|08|05)+([0-9]{8})\b)/;

        const nhanVienSchema = yup.object().shape({
            HoTenNV: yup.string().required("Họ tên là bắt buộc."),
            Password: yup.string().required("Mật khẩu là bắt buộc."),
            ChucVu: yup.string().required("Chức vụ là bắt buộc."),
            DiaChi: yup.string().required("Địa chỉ là bắt buộc."),
            SoDienThoai: yup.string().matches(sdtRegex, "Số điện thoại không hợp lệ."),
        });

        return {
            nvLocal: this.nhanvien,
            nhanVienSchema,
        };
    },
    methods: {
        submitNhanVien() {
            this.$emit("submit:nhanvien", this.nvLocal);
        },
        deleteNhanVien() {
            this.$emit("delete:nhanvien", this.nvLocal);
        },
    },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
