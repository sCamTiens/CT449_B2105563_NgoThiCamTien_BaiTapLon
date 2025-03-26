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
        <div><strong>Họ lót:</strong> {{ data.HoLot }}</div>
        <div><strong>Tên:</strong> {{ data.Ten }}</div>
        <div><strong>Ngày sinh:</strong> {{ data.NgaySinh }}</div>
        <div><strong>Phái:</strong> {{ data.Phai }}</div>
        <div><strong>Địa chỉ:</strong> {{ data.DiaChi }}</div>
        <div><strong>Điện thoại:</strong> {{ data.DienThoai }}</div>
    </div>
</template>
