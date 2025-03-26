<template>
    <Form @submit="submitNXB" :validation-schema="nxbSchema">
        <div class="form-group">
            <label for="TenNXB">Tên NXB</label>
            <Field name="TenNXB" type="text" class="form-control" v-model="nxbLocal.TenNXB" />
            <ErrorMessage name="TenNXB" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="DiaChi">Địa chỉ</label>
            <Field name="DiaChi" type="text" class="form-control" v-model="nxbLocal.DiaChi" />
            <ErrorMessage name="DiaChi" class="error-feedback" />
        </div>

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="nxbLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteNXB">
                Xóa
            </button>
        </div>

        <!-- Hiển thị lỗi nếu có -->
        <div v-if="deleteError" class="alert alert-danger mt-2">
            {{ deleteError }}
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";

export default {
    components: {
        Form,
        Field,
        ErrorMessage
    },
    emits: ["submit:nhaxuatban", "delete:nhaxuatban"],
    props: {
        nhaxuatban: { type: Object, required: true }
    },
    data() {

        const nxbSchema = yup.object().shape({
            TenNXB: yup.string().required("Tên nhà xuất bản là bắt buộc."),
            DiaChi: yup.string().required("Địa chỉ là bắt buộc.")
        });

        return {
            nxbLocal: this.nhaxuatban,
            nxbSchema,
            deleteError: "",
        };
    },
    methods: {
        submitNXB() {
            this.$emit("submit:nhaxuatban", this.nxbLocal);
        },

        async deleteNXB() {
            this.deleteError = "";
            try {
                const res = await axios.get(`/api/nhaxuatbans/book/${this.nxbLocal.MaNXB}`);
                if (res.data.length > 0) {
                    this.deleteError = "Không thể xóa! Nhà xuất bản vẫn còn sách trong hệ thống.";
                } else {
                    const confirmed = confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này?");
                    if (confirmed) {
                        this.$emit("delete:nhaxuatban", this.nxbLocal);
                    }
                }
            } catch (err) {
                console.error("Lỗi khi kiểm tra sách:", err);
                this.deleteError = "Lỗi khi kiểm tra sách thuộc nhà xuất bản.";
            }
        },
    }
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
