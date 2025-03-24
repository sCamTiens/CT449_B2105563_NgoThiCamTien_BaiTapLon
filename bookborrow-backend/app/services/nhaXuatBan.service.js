const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection("NhaXuatBan");
    this.Sach = client.db().collection("Sach"); // Liên kết với bảng Sách
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

  // Lấy thông tin sách theo mã nhà xuất bản
  async getBooksByPublisher(MaNXB) {
    const books = await this.Sach.find({ MaNXB }).toArray();
    return books;
  }

  // Lấy thông tin nhà xuất bản từ mã nhà xuất bản (MaNXB)
  async getPublisherInfo(MaNXB) {
    const publisher = await this.NhaXuatBan.findOne({ MaNXB });
    return publisher;
  }
}

module.exports = NhaXuatBanService;
