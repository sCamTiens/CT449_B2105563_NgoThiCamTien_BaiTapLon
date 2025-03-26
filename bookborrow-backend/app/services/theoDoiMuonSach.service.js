const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("TheoDoiMuonSach");
    this.Sach = client.db().collection("Sach");
    this.DocGia = client.db().collection("DocGia");
  }

  // Định nghĩa phương thức xử lý dữ liệu theo dõi mượn sách (extract)
  extractTheoDoiMuonSachData(payload) {
    const theoDoiMuonSach = {
      MaDocGia: payload.MaDocGia, // Mã độc giả
      MaSach: payload.MaSach, // Mã sách
      NgayMuon: payload.NgayMuon, // Ngày mượn sách
      NgayTra: payload.NgayTra, // Ngày trả sách
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

  // Lấy danh sách sách mà độc giả đã mượn
  async getBooksBorrowedByReader(MaDocGia) {
    const books = await this.TheoDoiMuonSach.find({ MaDocGia }).toArray();
    return books;
  }

  // Lấy thông tin sách mượn bởi nhân viên (Theo Dõi Mượn Sách)
  async getBooksBorrowedByEmployee(MSNV) {
    const books = await this.TheoDoiMuonSach.find({ MSNV }).toArray();
    return books;
  }

  // Lấy thông tin chi tiết về sách (bao gồm tên sách, nhà xuất bản, ...)
  async getBookDetails(MaSach) {
    const book = await this.Sach.findOne({ MaSach });
    return book;
  }

  // Kiểm tra xem sách đã được trả chưa
  async checkReturnStatus(MaSach) {
    const record = await this.TheoDoiMuonSach.findOne({
      MaSach,
      NgayTra: { $exists: false }, // Kiểm tra sách chưa được trả
    });
    return record ? false : true; // Trả về false nếu chưa trả, true nếu sách đã được trả
  }

  // Kiểm tra sách có tồn tại trong bảng TheoDoiMuonSach không
  async checkBookExistsInBorrowList(MaSach) {
    try {
      const record = await this.TheoDoiMuonSach.findOne({ MaSach });
      return !!record; // Trả về true nếu có bản ghi, false nếu không
    } catch (error) {
      throw new Error("Lỗi khi kiểm tra sách trong danh sách mượn");
    }
  }
}

module.exports = TheoDoiMuonSachService;
