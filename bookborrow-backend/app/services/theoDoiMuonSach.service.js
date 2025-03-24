const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("TheoDoiMuonSach");
  }

  // Định nghĩa phương thức xử lý dữ liệu theo dõi mượn sách (extract)
  extractTheoDoiMuonSachData(payload) {
    const theoDoiMuonSach = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: payload.NgayMuon,
      NgayTra: payload.NgayTra,
    };
    // Xóa các trường không có dữ liệu
    Object.keys(theoDoiMuonSach).forEach(
      (key) => !theoDoiMuonSach[key] && delete theoDoiMuonSach[key]
    );
    return theoDoiMuonSach;
  }

  // Tạo mới một bản ghi theo dõi mượn sách
  async create(payload) {
    const theoDoiMuonSach = this.extractTheoDoiMuonSachData(payload);
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      { MaDocGia: theoDoiMuonSach.MaDocGia, MaSach: theoDoiMuonSach.MaSach },
      { $set: theoDoiMuonSach },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  // Tìm kiếm theo dõi mượn sách theo filter
  async find(filter) {
    const cursor = await this.TheoDoiMuonSach.find(filter);
    return await cursor.toArray();
  }

  // Tìm theo dõi mượn sách theo mã độc giả và mã sách
  async findByDocGiaAndSach(MaDocGia, MaSach) {
    return await this.find({
      MaDocGia: MaDocGia,
      MaSach: MaSach,
    });
  }

  // Tìm theo dõi mượn sách theo ID
  async findById(id) {
    const result = await this.find({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Cập nhật thông tin theo dõi mượn sách
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractTheoDoiMuonSachData(payload);
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa bản ghi theo dõi mượn sách theo ID
  async delete(id) {
    const result = await this.TheoDoiMuonSach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả bản ghi theo dõi mượn sách
  async deleteAll() {
    const result = await this.TheoDoiMuonSach.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = TheoDoiMuonSachService;
