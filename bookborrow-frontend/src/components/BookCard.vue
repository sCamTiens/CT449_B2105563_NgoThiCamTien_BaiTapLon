<script>
export default {
    props: {
        data: { type: Object, required: true },
    },
};
</script>

<template>
    <div class="p-2 border rounded bg-white shadow-sm mb-3">
        <div><strong>Mã sách:</strong> {{ data.MaSach }}</div>
        <div><strong>Tên sách:</strong> {{ data.TenSach }}</div>
        <div><strong>Đơn giá:</strong> {{ data.DonGia }} VNĐ</div>
        <div><strong>Số quyển:</strong> {{ data.SoQuyen }}</div>
        <div><strong>Năm XB:</strong> {{ data.NamXuatBan }}</div>
        <div><strong>Mã NXB:</strong> {{ data.MaNXB }}</div>
        <div><strong>Tác giả:</strong> {{ data.TacGia }}</div>
    </div>
</template>
