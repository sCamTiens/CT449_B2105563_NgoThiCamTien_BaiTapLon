<template>
    <div class="page">
        <div class="d-flex justify-content-center mb-3">
            <h4 class="fw-bold">TÀI KHOẢN CÁ NHÂN</h4>
        </div>
        <form @submit.prevent="updateAccount">
            <div class="form-group">
                <label>Mã nhân viên</label>
                <input type="text" class="form-control" :value="nhanvien.MSNV" disabled />
            </div>

            <div class="form-group">
                <label>Họ tên</label>
                <input v-model="nhanvien.HoTenNV" type="text" class="form-control" />
            </div>

            <div class="form-group">
                <label>Mật khẩu</label>
                <input v-model="nhanvien.Password" type="password" class="form-control" />
            </div>

            <div class="form-group">
                <label>Địa chỉ</label>
                <input v-model="nhanvien.DiaChi" type="text" class="form-control" />
            </div>

            <div class="form-group">
                <label>Số điện thoại</label>
                <input v-model="nhanvien.SoDienThoai" type="text" class="form-control" />
            </div>
            <div class="d-flex justify-content-center mb-3">
                <button class="btn btn-primary">Cập nhật</button>
            </div>
        </form>

        <div v-if="message" class="alert alert-success mt-3">
            {{ message }}
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            nhanvien: {
                MSNV: "",
                HoTenNV: "",
                Password: "",
                DiaChi: "",
                SoDienThoai: ""
            },
            message: ""
        };
    },
    created() {
        const user = JSON.parse(localStorage.getItem("nhanvien"));
        if (user?.MSNV) {
            this.fetchNhanVien(user.MSNV);
        }
    },
    methods: {
        async fetchNhanVien(MSNV) {
            try {
                const res = await axios.get(`/api/nhanviens`);
                const found = res.data.find(nv => nv.MSNV === MSNV);
                if (found) {
                    this.nhanvien = { ...found };
                }
            } catch (err) {
                console.error("Lỗi khi tải thông tin nhân viên:", err);
            }
        },
        async updateAccount() {
            try {
                await axios.put(`/api/nhanviens/${this.nhanvien._id}`, this.nhanvien);
                localStorage.setItem("nhanvien", JSON.stringify(this.nhanvien));
                this.message = "Cập nhật thông tin thành công!";
            } catch (err) {
                console.error("Lỗi khi cập nhật thông tin:", err);
                this.message = "Cập nhật thất bại.";
            }
        }
    }
};
</script>

<style scoped>
.page {
    max-width: 800px;
    margin: auto;
    margin-top: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
}
</style>
