<script>
export default {
    props: {
        data: { type: Object, required: true },
        type: { type: String, required: true }, // "book", "docgia", "nhanvien"...
    },
};
</script>

<template>
    <div class="p-2 border rounded bg-white shadow-sm mb-3">
        <template v-if="type === 'book'">
            <div><strong>Mã sách:</strong> {{ data.MaSach }}</div>
            <div><strong>Tên sách:</strong> {{ data.TenSach }}</div>
            <div><strong>Đơn giá:</strong> {{ data.DonGia }} VNĐ</div>
            <div><strong>Số quyển:</strong> {{ data.SoQuyen }}</div>
            <div><strong>Năm XB:</strong> {{ data.NamXuatBan }}</div>
            <div><strong>Mã NXB:</strong> {{ data.MaNXB }}</div>
            <div><strong>Nguồn gốc:</strong> {{ data.NguonGoc }}</div>
        </template>

        <template v-else-if="type === 'docgia'">
            <div><strong>Mã độc giả:</strong> {{ data.MaDocGia }}</div>
            <div><strong>Họ lót:</strong> {{ data.HoLot }}</div>
            <div><strong>Tên:</strong> {{ data.Ten }}</div>
            <div><strong>Ngày sinh:</strong> {{ data.NgaySinh }}</div>
            <div><strong>Phái:</strong> {{ data.Phai }}</div>
            <div><strong>Địa chỉ:</strong> {{ data.DiaChi }}</div>
            <div><strong>Điện thoại:</strong> {{ data.DienThoai }}</div>
        </template>

        <template v-else-if="type === 'nhanvien'">
            <div><strong>Mã NV:</strong> {{ data.MSNV }}</div>
            <div><strong>Họ tên:</strong> {{ data.HoTenNV }}</div>
            <div><strong>Chức vụ:</strong> {{ data.ChucVu }}</div>
            <div><strong>Địa chỉ:</strong> {{ data.DiaChi }}</div>
            <div><strong>SĐT:</strong> {{ data.SoDienThoai }}</div>
        </template>

        <template v-else-if="type === 'nxb'">
            <div><strong>Mã NXB:</strong> {{ data.MaNXB }}</div>
            <div><strong>Tên NXB:</strong> {{ data.TenNXB }}</div>
            <div><strong>Địa chỉ:</strong> {{ data.DiaChi }}</div>
        </template>

        <template v-else-if="type === 'muon'">
            <div><strong>Mã độc giả:</strong> {{ data.MaDocGia }}</div>
            <div><strong>Mã sách:</strong> {{ data.MaSach }}</div>
            <div><strong>Ngày mượn:</strong> {{ data.NgayMuon }}</div>
            <div><strong>Ngày trả:</strong> {{ data.NgayTra || 'Chưa trả' }}</div>
        </template>

        <template v-else>
            <div class="text-danger">Loại dữ liệu không được hỗ trợ</div>
        </template>
    </div>
</template>
