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
      NguonGoc: payload.NguonGoc,
    };

    // Xóa các trường không có dữ liệu
    Object.keys(sach).forEach((key) => !sach[key] && delete sach[key]);
    return sach;
  }

  // Tạo mới sách
  async create(payload) {
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
    const result = await this.Sach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
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
}

module.exports = BookService;
