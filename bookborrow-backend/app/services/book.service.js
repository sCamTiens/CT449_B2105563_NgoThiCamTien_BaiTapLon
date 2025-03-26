const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Sach = client.db().collection("Sach");
    this.NhaXuatBan = client.db().collection("NhaXuatBan");
  }

  // Định nghĩa phương thức xử lý dữ liệu sách (extract)
  extractSachData(payload) {
    const sach = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: payload.DonGia,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: payload.MaNXB, // Mã nhà xuất bản
      TacGia: payload.TacGia,
    };

    // Xóa các trường không có dữ liệu
    Object.keys(sach).forEach((key) => !sach[key] && delete sach[key]);
    return sach;
  }

  // Tạo mới sách
  async create(payload) {
    // Nếu không có MaSach, tự tạo mã mới
    if (!payload.MaSach) {
      const latest = await this.Sach.find({})
        .sort({ MaSach: -1 }) // Sắp xếp giảm dần theo MaSach
        .limit(1)
        .toArray();

      let nextNumber = 1;

      if (latest.length > 0) {
        const lastMaSach = latest[0].MaSach;
        const match = lastMaSach.match(/\d+$/); // Lấy phần số ở cuối
        if (match) {
          nextNumber = parseInt(match[0]) + 1;
        }
      }

      payload.MaSach = `S${nextNumber.toString().padStart(3, "0")}`;
    }

    const sach = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      { MaSach: sach.MaSach },
      { $set: sach },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  // Tìm kiếm sách theo filter
  async find(filter) {
    const cursor = await this.Sach.find(filter);
    return await cursor.toArray();
  }

  // Tìm sách theo tên
  async findByName(name) {
    return await this.find({
      TenSach: { $regex: new RegExp(name), $options: "i" }, // Tìm theo tên sách
    });
  }

  // Tìm sách theo ID
  async findById(id) {
    const result = await this.find({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Cập nhật thông tin sách theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa sách theo ID
  async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ.");
    }

    const result = await this.Sach.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return result;
  }

  // Xóa tất cả sách
  async deleteAll() {
    const result = await this.Sach.deleteMany({});
    return result.deletedCount;
  }

  // Tìm sách theo mã nhà xuất bản (MaNXB)
  async findByPublisher(MaNXB) {
    return await this.find({ MaNXB });
  }

  // Lấy thông tin Nhà Xuất Bản theo MaNXB
  async getPublisherInfo(MaNXB) {
    const publisher = await this.NhaXuatBan.findOne({ MaNXB });
    return publisher;
  }

  // Lấy danh sách tất cả nhà xuất bản
  async getAllNXB() {
    try {
      const cursor = await this.NhaXuatBan.find({});
      return await cursor.toArray();
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách nhà xuất bản");
    }
  }
}

module.exports = BookService;
