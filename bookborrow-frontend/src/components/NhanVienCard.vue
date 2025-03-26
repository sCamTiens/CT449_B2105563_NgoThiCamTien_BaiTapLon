<script>
export default {
    props: {
        data: { type: Object, required: true },
    },
};
</script>

<template>
    <div class="p-2 border rounded bg-white shadow-sm mb-3">
        <div><strong>Mã NV:</strong> {{ data.MSNV }}</div>
        <div><strong>Họ tên:</strong> {{ data.HoTenNV }}</div>
        <div><strong>Chức vụ:</strong> {{ data.ChucVu }}</div>
        <div><strong>Địa chỉ:</strong> {{ data.DiaChi }}</div>
        <div><strong>SĐT:</strong> {{ data.SoDienThoai }}</div>
    </div>
</template>
