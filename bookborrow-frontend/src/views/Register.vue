<template>
    <div class="page">
        <h4>Đăng Ký</h4>
        <Form @submit="registerNhanVien" :validation-schema="schema">
            <!-- Họ tên -->
            <div class="form-group">
                <label for="HoTenNV">Họ Tên</label>
                <Field name="HoTenNV" type="text" class="form-control" v-model="form.HoTenNV" />
                <ErrorMessage name="HoTenNV" class="error-feedback" />
            </div>

            <!-- Mật khẩu -->
            <div class="form-group">
                <label for="Password">Mật Khẩu</label>
                <Field name="Password" type="password" class="form-control" v-model="form.Password" />
                <ErrorMessage name="Password" class="error-feedback" />
            </div>

            <!-- Nhập lại mật khẩu -->
            <div class="form-group">
                <label for="ConfirmPassword">Nhập lại Mật Khẩu</label>
                <Field name="ConfirmPassword" type="password" class="form-control" v-model="form.ConfirmPassword" />
                <ErrorMessage name="ConfirmPassword" class="error-feedback" />
            </div>

            <!-- Địa chỉ -->
            <div class="form-group">
                <label for="DiaChi">Địa Chỉ</label>
                <Field name="DiaChi" type="text" class="form-control" v-model="form.DiaChi" />
                <ErrorMessage name="DiaChi" class="error-feedback" />
            </div>

            <!-- Số điện thoại -->
            <div class="form-group">
                <label for="SoDienThoai">Số Điện Thoại</label>
                <Field name="SoDienThoai" type="text" class="form-control" v-model="form.SoDienThoai" />
                <ErrorMessage name="SoDienThoai" class="error-feedback" />
            </div>

            <!-- Chức vụ mặc định -->
            <input type="hidden" v-model="form.ChucVu" />

            <div class="form-group">
                <button type="submit" class="btn btn-success">Đăng Ký</button>
            </div>

            <p class="mt-3">
                Bạn đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
            </p>
        </Form>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import axios from "axios";

export default {
    components: { Form, Field, ErrorMessage },
    data() {
        const schema = yup.object().shape({
            HoTenNV: yup.string().required("Họ tên là bắt buộc."),
            Password: yup.string().required("Mật khẩu là bắt buộc."),
            ConfirmPassword: yup
                .string()
                .oneOf([yup.ref("Password")], "Mật khẩu không khớp.")
                .required("Vui lòng nhập lại mật khẩu."),
            DiaChi: yup.string().required("Địa chỉ là bắt buộc."),
            SoDienThoai: yup.string().required("Số điện thoại là bắt buộc."),
        });

        return {
            schema,
            form: {
                HoTenNV: "",
                Password: "",
                ConfirmPassword: "",
                DiaChi: "",
                SoDienThoai: "",
                ChucVu: "Nhân Viên",
            },
        };
    },
    methods: {
        async registerNhanVien() {
            try {
                const { ConfirmPassword, ...payload } = this.form;
                await axios.post("/api/nhanviens/register", payload);
                alert("Đăng ký thành công!");
                this.$router.push({ name: "login" });
            } catch (error) {
                console.error("Lỗi đăng ký:", error);
                alert("Đăng ký thất bại.");
            }
        },
    },
};
</script>

<style scoped>
.page {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.error-feedback {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>
