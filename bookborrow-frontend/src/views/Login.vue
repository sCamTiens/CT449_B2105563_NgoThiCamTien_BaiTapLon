<template>
    <div class="page">
        <h4>Đăng Nhập</h4>
        <Form @submit="loginNhanVien" :validation-schema="loginSchema">
            <div class="form-group">
                <label for="username">Họ Tên</label>
                <Field name="username" type="text" class="form-control" v-model="loginData.username" />
                <ErrorMessage name="username" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="password">Mật khẩu</label>
                <Field name="password" type="password" class="form-control" v-model="loginData.password" />
                <ErrorMessage name="password" class="error-feedback" />
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-primary">Đăng Nhập</button>
            </div>

            <div v-if="loginError" class="alert alert-danger mt-2">
                {{ loginError }}
            </div>

            <p class="mt-3">
                Bạn chưa có tài khoản? <router-link to="/register">Đăng ký</router-link>
            </p>
        </Form>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';

export default {
    components: { Form, Field, ErrorMessage },
    data() {
        return {
            loginData: {
                username: '',
                password: ''
            },
            loginError: '',
            loginSchema: yup.object().shape({
                username: yup.string().required('Họ tên là bắt buộc'),
                password: yup.string().required('Mật khẩu là bắt buộc')
            })
        };
    },
    methods: {
        async loginNhanVien() {
            this.loginError = '';
            try {
                const res = await axios.post("/api/nhanviens/login", this.loginData);
                alert(res.data.message);
                // Ví dụ: lưu vào localStorage, chuyển trang...
                localStorage.setItem("nhanvien", JSON.stringify(res.data.user));
                window.location.href = "/books";
            } catch (err) {
                console.error(err);
                this.loginError = err.response?.data?.message || "Lỗi đăng nhập";
            }
        }
    }
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
