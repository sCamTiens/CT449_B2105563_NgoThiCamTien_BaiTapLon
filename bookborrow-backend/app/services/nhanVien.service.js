const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("NhanVien");
  }

  // Định nghĩa phương thức xử lý dữ liệu nhân viên (extract)
  extractNhanVienData(payload) {
    const nhanVien = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      ChucVu: payload.ChucVu,
      DiaChi: payload.DiaChi,
      SoDienThoai: payload.SoDienThoai,
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
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Cập nhật thông tin nhân viên theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractNhanVienData(payload);
    const result = await this.NhanVien.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa nhân viên theo ID
  async delete(id) {
    const result = await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả nhân viên
  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NhanVienService;
