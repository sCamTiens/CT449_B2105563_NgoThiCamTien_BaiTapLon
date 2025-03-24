const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("NhanVien");
    this.TheoDoiMuonSach = client.db().collection("TheoDoiMuonSach");
  }

  // Định nghĩa phương thức xử lý dữ liệu nhân viên (extract)
  extractNhanVienData(payload) {
    const nhanVien = {
      MSNV: payload.MSNV, // Mã nhân viên
      HoTenNV: payload.HoTenNV, // Họ và tên nhân viên
      Password: payload.Password, // Mật khẩu nhân viên
      ChucVu: payload.ChucVu, // Chức vụ nhân viên
      DiaChi: payload.DiaChi, // Địa chỉ nhân viên
      SoDienThoai: payload.SoDienThoai, // Số điện thoại nhân viên
    };
    // Xóa các trường không có dữ liệu
    Object.keys(nhanVien).forEach(
      (key) => !nhanVien[key] && delete nhanVien[key]
    );
    return nhanVien;
  }

  // Tạo mới nhân viên
  async create(payload) {
    const nhanVien = this.extractNhanVienData(payload);
    const result = await this.NhanVien.findOneAndUpdate(
      { MSNV: nhanVien.MSNV },
      { $set: nhanVien },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  // Tìm kiếm nhân viên theo filter
  async find(filter) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  // Tìm nhân viên theo mã nhân viên (MSNV)
  async findById(id) {
    const result = await this.find({
      MSNV: id, // Sử dụng MSNV để tìm nhân viên
    });
    return result;
  }

  // Cập nhật thông tin nhân viên theo MSNV
  async update(id, payload) {
    const filter = {
      MSNV: id, // Sử dụng MSNV để tìm nhân viên
    };
    const update = this.extractNhanVienData(payload);
    const result = await this.NhanVien.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa nhân viên theo MSNV
  async delete(id) {
    const result = await this.NhanVien.findOneAndDelete({
      MSNV: id, // Sử dụng MSNV để xóa nhân viên
    });
    return result;
  }

  // Xóa tất cả nhân viên
  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }

  // Lấy danh sách sách mà nhân viên đã quản lý (theo dõi mượn sách)
  async getBooksByEmployee(MSNV) {
    const books = await this.TheoDoiMuonSach.find({ MSNV }).toArray();
    return books;
  }

  // Thêm thông tin mượn sách cho nhân viên (theo dõi việc mượn sách)
  async addBorrowedBook(MSNV, MaSach, NgayMuon) {
    const result = await this.TheoDoiMuonSach.insertOne({
      MSNV,
      MaSach,
      NgayMuon,
      NgayTra: null, // Ngày trả sách sẽ được cập nhật khi sách được trả
    });
    return result;
  }

  // Cập nhật thông tin trả sách
  async returnBook(MaSach) {
    const result = await this.TheoDoiMuonSach.updateOne(
      { MaSach, NgayTra: null }, // Tìm sách chưa trả
      { $set: { NgayTra: new Date() } }
    );
    return result;
  }
}

module.exports = NhanVienService;
