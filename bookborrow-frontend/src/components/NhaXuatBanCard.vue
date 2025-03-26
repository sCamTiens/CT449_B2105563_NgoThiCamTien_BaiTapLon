<script>
export default {
    props: {
        data: { type: Object, required: true },
    },
};
</script>

<template>
    <div class="p-2 border rounded bg-white shadow-sm mb-3">
        <div><strong>Mã NXB:</strong> {{ data.MaNXB }}</div>
        <div><strong>Tên NXB:</strong> {{ data.TenNXB }}</div>
        <div><strong>Địa chỉ:</strong> {{ data.DiaChi }}</div>
    </div>
</template>
