<template>
    <Form @submit="submitDocGia" :validation-schema="docGiaFormSchema">
        <div class="form-group">
            <label for="HoLot">Họ lót</label>
            <Field name="HoLot" type="text" class="form-control" v-model="docGiaLocal.HoLot" />
            <ErrorMessage name="HoLot" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="Ten">Tên</label>
            <Field name="Ten" type="text" class="form-control" v-model="docGiaLocal.Ten" />
            <ErrorMessage name="Ten" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="NgaySinh">Ngày sinh</label>
            <Field name="NgaySinh" type="date" class="form-control" v-model="docGiaLocal.NgaySinh" />
            <ErrorMessage name="NgaySinh" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="Phai">Giới tính</label>
            <Field as="select" name="Phai" class="form-control" v-model="docGiaLocal.Phai">
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </Field>
            <ErrorMessage name="Phai" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="DiaChi">Địa chỉ</label>
            <Field name="DiaChi" type="text" class="form-control" v-model="docGiaLocal.DiaChi" />
            <ErrorMessage name="DiaChi" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="DienThoai">Điện thoại</label>
            <Field name="DienThoai" type="text" class="form-control" v-model="docGiaLocal.DienThoai" />
            <ErrorMessage name="DienThoai" class="error-feedback" />
        </div>

        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="docGiaLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteDocGia">
                Xóa
            </button>
        </div>

        <div v-if="deleteError" class="alert alert-danger mt-2">
            {{ deleteError }}
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios"; // sử dụng axios để gọi API

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:docgia", "delete:docgia"],
    props: {
        docgia: { type: Object, required: true }
    },
    data() {
        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

        const docGiaFormSchema = yup.object().shape({
            HoLot: yup.string().required("Họ lót là bắt buộc."),
            Ten: yup.string().required("Tên là bắt buộc."),
            NgaySinh: yup.date().required("Ngày sinh là bắt buộc."),
            Phai: yup.string().required("Giới tính là bắt buộc."),
            DiaChi: yup.string().required("Địa chỉ là bắt buộc."),
            DienThoai: yup.string().matches(phoneRegex, "Số điện thoại không hợp lệ."),
        });

        return {
            docGiaLocal: this.docgia,
            docGiaFormSchema,
            deleteError: "", // thông báo lỗi nếu không xoá được
        };
    },
    methods: {
        submitDocGia() {
            this.$emit("submit:docgia", this.docGiaLocal);
        },
        async deleteDocGia() {
            this.deleteError = "";
            try {
                const MaDocGia = this.docGiaLocal.MaDocGia;
                const res = await axios.get(`/api/docgias/check-borrowed/${MaDocGia}`);
                if (res.data.hasBorrowed) {
                    this.deleteError = "Không thể xóa! Độc giả này đang mượn sách.";
                } else {
                    const confirmed = confirm("Bạn có chắc chắn muốn xóa độc giả này?");
                    if (confirmed) {
                        this.$emit("delete:docgia", this.docGiaLocal);
                    }
                }
            } catch (err) {
                console.error(err);
                this.deleteError = "Lỗi kiểm tra trạng thái mượn sách.";
            }
        }
    }
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>