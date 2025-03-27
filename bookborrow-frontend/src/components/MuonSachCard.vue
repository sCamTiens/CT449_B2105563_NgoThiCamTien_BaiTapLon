<script>
export default {
    props: {
        data: { type: Object, required: true },
    },
};
</script>

<template>
    <div class="p-2 border rounded bg-white shadow-sm mb-3">
        <div><strong>Mã độc giả:</strong> {{ data.MaDocGia }}</div>
        <div><strong>Mã sách:</strong> {{ data.MaSach }}</div>
        <div><strong>Ngày mượn:</strong> {{ data.NgayMuon }}</div>
        <div><strong>Ngày trả:</strong> {{ data.NgayTra || 'Chưa trả' }}</div>
        <div><strong>Số lượng mượn:</strong> {{ data.SoLuong || 'Chưa xác định' }}</div>
    </div>
</template>
