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
    // Nếu không có MSNV, tự tạo mã mới
    if (!payload.MSNV) {
      const latest = await this.NhanVien.find({})
        .sort({ MSNV: -1 }) // Sắp xếp giảm dần theo MSNV
        .limit(1)
        .toArray();

      let nextNumber = 1;

      if (latest.length > 0) {
        const lastMSNV = latest[0].MSNV;
        const match = lastMSNV.match(/\d+$/); // Lấy phần số ở cuối
        if (match) {
          nextNumber = parseInt(match[0]) + 1;
        }
      }

      payload.MSNV = `NV${nextNumber.toString().padStart(3, "0")}`; // VD: NV001, NV002
    }

    // Tiếp tục xử lý tạo như cũ
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

  // Cập nhật thông tin nhân viên theo MSNV
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

  // Xóa nhân viên theo MSNV
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

  // Đăng nhập bằng họ tên và mật khẩu
  async login(username, password) {
    //console.log("Tìm nhân viên:", username, password);
    const user = await this.NhanVien.findOne({ HoTenNV: username });

    if (!user) return null;

    // So sánh mật khẩu (nên mã hóa thực tế)
    if (user.Password === password) {
      return user;
    }

    return null;
  }

  // Đăng ký nhân viên mới
  async register(payload) {
    // Nếu chưa có MSNV thì tạo tự động
    if (!payload.MSNV) {
      const latest = await this.NhanVien.find({})
        .sort({ MSNV: -1 }) // Sắp giảm dần theo MSNV
        .limit(1)
        .toArray();

      let nextNumber = 1;

      if (latest.length > 0) {
        const lastMSNV = latest[0].MSNV;
        const match = lastMSNV.match(/\d+$/); // Lấy phần số ở cuối
        if (match) {
          nextNumber = parseInt(match[0]) + 1;
        }
      }

      payload.MSNV = `NV${nextNumber.toString().padStart(3, "0")}`; // VD: NV001, NV002...
    }

    // Kiểm tra trùng
    const existing = await this.NhanVien.findOne({ MSNV: payload.MSNV });
    if (existing) {
      throw new Error("Mã nhân viên đã tồn tại!");
    }

    const nhanVien = this.extractNhanVienData(payload);
    const result = await this.NhanVien.insertOne(nhanVien);
    return result;
  }
}

module.exports = NhanVienService;
