const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection("NhaXuatBan");
  }

  // Định nghĩa phương thức xử lý dữ liệu nhà xuất bản (extract)
  extractNhaXuatBanData(payload) {
    const nhaXuatBan = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };
    // Xóa các trường không có dữ liệu
    Object.keys(nhaXuatBan).forEach(
      (key) => !nhaXuatBan[key] && delete nhaXuatBan[key]
    );
    return nhaXuatBan;
  }

  // Tạo mới nhà xuất bản
  async create(payload) {
    // Nếu không có MaNXB, tự tạo mã mới
    if (!payload.MaNXB) {
      const latest = await this.NhaXuatBan.find({})
        .sort({ MaNXB: -1 }) // Sắp xếp giảm dần theo MaNXB
        .limit(1)
        .toArray();

      let nextNumber = 1;

      if (latest.length > 0) {
        const lastMaNXB = latest[0].MaNXB;
        const match = lastMaNXB.match(/\d+$/); // Lấy phần số ở cuối
        if (match) {
          nextNumber = parseInt(match[0]) + 1;
        }
      }

      payload.MaNXB = `NXB${nextNumber.toString().padStart(3, "0")}`; // VD: NV001, NV002
    }

    const nhaXuatBan = this.extractNhaXuatBanData(payload);
    const result = await this.NhaXuatBan.findOneAndUpdate(
      { MaNXB: nhaXuatBan.MaNXB },
      { $set: nhaXuatBan },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  // Tìm kiếm nhà xuất bản theo filter
  async find(filter) {
    const cursor = await this.NhaXuatBan.find(filter);
    return await cursor.toArray();
  }

  // Tìm nhà xuất bản theo tên
  async findByName(name) {
    return await this.find({
      TenNXB: { $regex: new RegExp(name), $options: "i" }, // Tìm theo tên nhà xuất bản
    });
  }

  // Tìm nhà xuất bản theo ID
  async findById(id) {
    const result = await this.find({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Cập nhật thông tin nhà xuất bản theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractNhaXuatBanData(payload);
    const result = await this.NhaXuatBan.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa nhà xuất bản theo ID
  async delete(id) {
    const result = await this.NhaXuatBan.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả nhà xuất bản
  async deleteAll() {
    const result = await this.NhaXuatBan.deleteMany({});
    return result.deletedCount;
  }

  // Lấy danh sách sách theo MaNXB
  async getBooksByPublisher(MaNXB) {
    try {
      return await this.bookCollection.find({ MaNXB }).toArray(); // Truy vấn tất cả sách thuộc MaNXB
    } catch (error) {
      throw new Error("Lỗi khi lấy sách");
    }
  }

  // Kiểm tra xem MaNXB có tồn tại trong cơ sở dữ liệu không
  async checkMaNXBExists(MaNXB) {
    try {
      // Sử dụng countDocuments để đếm số lượng tài liệu có MaNXB trùng với MaNXB cần kiểm tra
      const count = await this.NhaXuatBan.countDocuments({ MaNXB });
      return count > 0; // Nếu count > 0, MaNXB đã tồn tại
    } catch (error) {
      throw new Error("Lỗi khi kiểm tra MaNXB");
    }
  }
}

module.exports = NhaXuatBanService;
