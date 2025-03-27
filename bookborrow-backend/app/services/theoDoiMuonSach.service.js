const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("TheoDoiMuonSach");
    this.Sach = client.db().collection("Sach");
    this.DocGia = client.db().collection("Docgia");
  }

  // Định nghĩa phương thức xử lý dữ liệu theo dõi mượn sách (extract)
  extractTheoDoiMuonSachData(payload) {
    const theoDoiMuonSach = {
      MaDocGia: payload.MaDocGia, // Mã độc giả
      MaSach: payload.MaSach, // Mã sách
      NgayMuon: payload.NgayMuon, // Ngày mượn sách
      NgayTra: payload.NgayTra, // Ngày trả sách
      SoLuong: payload.SoLuong || 1, // Số lượng mượn
      TrangThai: "Đang mượn", // Trạng thái mặc định khi tạo mới
    };
    // Xóa các trường không có dữ liệu
    Object.keys(theoDoiMuonSach).forEach(
      (key) => !theoDoiMuonSach[key] && delete theoDoiMuonSach[key]
    );
    return theoDoiMuonSach;
  }

  // Tạo mới một bản ghi theo dõi mượn sách
  // async create(payload) {
  //   const theoDoiMuonSach = this.extractTheoDoiMuonSachData(payload);
  //   const result = await this.TheoDoiMuonSach.findOneAndUpdate(
  //     { MaDocGia: theoDoiMuonSach.MaDocGia, MaSach: theoDoiMuonSach.MaSach },
  //     { $set: theoDoiMuonSach },
  //     { returnDocument: "after", upsert: true }
  //   );
  //   return result;
  // }

  // Tạo mới một bản ghi theo dõi mượn sách, có kiểm tra và trừ số lượng sách
  async create(payload) {
    const theoDoiMuonSach = this.extractTheoDoiMuonSachData(payload);
    const { MaSach } = theoDoiMuonSach;
    const soLuongMuon = theoDoiMuonSach.SoLuong; // Số lượng mượn

    // 1. Kiểm tra sách còn tồn kho không
    const book = await this.Sach.findOne({ MaSach });

    if (!book) {
      throw new Error(`Không tìm thấy sách với mã ${MaSach}`);
    }

    if (book.SoQuyen < soLuongMuon) {
      throw new Error(
        `Sách "${book.TenSach}" chỉ còn ${book.SoQuyen} cuốn trong kho`
      );
    }

    // 2. Trừ số lượng sách trong kho
    await this.Sach.updateOne({ MaSach }, { $inc: { SoQuyen: -soLuongMuon } });

    // 3. Ghi nhận mượn sách vào bảng TheoDoiMuonSach (chỉ lưu vào cơ sở dữ liệu khi đã kiểm tra đủ thông tin)
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      { MaDocGia: theoDoiMuonSach.MaDocGia, MaSach: MaSach },
      { $set: theoDoiMuonSach },
      { returnDocument: "after", upsert: true }
    );

    if (result) {
      return result;
    } else {
      throw new Error("Không thể thêm bản ghi theo dõi mượn sách");
    }
  }

  // Cập nhật trạng thái trả sách
  async returnBook(id, NgayTra) {
    // 1. Cập nhật ngày trả trong bảng TheoDoiMuonSach
    const result = await this.update(id, { NgayTra, TrangThai: "Đã trả" });

    if (result.value) {
      const { MaSach, SoLuong } = result.value; // Lấy mã sách và số lượng mượn

      // 2. Cộng lại số lượng sách trong kho khi trả sách
      await this.Sach.updateOne({ MaSach }, { $inc: { SoQuyen: SoLuong } });

      return result;
    }

    return null;
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
  // async getBooksBorrowedByEmployee(MSNV) {
  //   const books = await this.TheoDoiMuonSach.find({ MSNV }).toArray();
  //   return books;
  // }

  // Lấy thông tin chi tiết về sách (bao gồm tên sách, nhà xuất bản, ...)
  async getBookDetails(MaSach) {
    const book = await this.Sach.findOne({ MaSach });
    return book;
  }

  // Lấy thông tin chi tiết về độc giả (bao gồm họ tên, địa chỉ,...)
  async getReaderDetails(MaDocGia) {
    const docgia = await this.DocGia.findOne({ MaDocGia });
    return docgia;
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

  // Lấy tất cả bản ghi theo dõi mượn sách
  async getAll() {
    try {
      // Lấy tất cả các bản ghi theo dõi mượn sách
      const cursor = await this.TheoDoiMuonSach.find({});
      const documents = await cursor.toArray();

      // Lặp qua từng bản ghi để thêm thông tin sách và độc giả
      for (let doc of documents) {
        const book = await this.Sach.findOne({ MaSach: doc.MaSach });
        const docgia = await this.DocGia.findOne({ MaDocGia: doc.MaDocGia });

        // Gán thông tin sách và độc giả vào bản ghi
        doc.TenSach = book ? book.TenSach : "Không tìm thấy sách";
        doc.TenDocGia = docgia
          ? docgia.HoLot + " " + docgia.Ten
          : "Không tìm thấy độc giả";
        doc.SoLuong = doc.SoLuong || 1; // Mặc định số lượng là 1 nếu không có
      }

      return documents;
    } catch (error) {
      throw new Error("Error fetching TheoDoiMuonSach data");
    }
  }

  // Lấy chi tiết độc giả theo MaDocGia
  async getReaderDetails(MaDocGia) {
    try {
      const reader = await this.DocGia.findOne({ MaDocGia });
      if (!reader) {
        throw new Error("Reader not found");
      }
      return reader;
    } catch (error) {
      console.error("Error in getReaderDetails:", error);
      throw error; // Quay lại lỗi nếu không tìm thấy độc giả
    }
  }

  // Kiểm tra xem bản ghi đã quá hạn hay không
  async checkOverdue(MaDocGia, MaSach) {
    // Tìm bản ghi mượn sách có trạng thái "Đang mượn" và đã có ngày trả
    const record = await this.TheoDoiMuonSach.findOne({
      MaDocGia,
      MaSach,
      TrangThai: "Đang mượn", // Trạng thái mượn sách chưa trả
    });

    if (!record) {
      throw new Error("Không tìm thấy bản ghi mượn sách");
    }

    const currentDate = new Date(); // Ngày hiện tại
    const returnDate = new Date(record.NgayTra); // Ngày trả sách

    // So sánh ngày trả với ngày hiện tại để kiểm tra quá hạn
    return returnDate < currentDate;
  }

  // Đếm số lượng bản ghi quá hạn
  async countOverdue() {
    const currentDate = new Date(); // Ngày hiện tại
    const overdueCount = await this.TheoDoiMuonSach.countDocuments({
      NgayTra: { $lt: currentDate }, // Ngày trả nhỏ hơn ngày hiện tại
      TrangThai: "Đang mượn", // Chỉ tính các bản ghi chưa trả
    });
    return overdueCount;
  }

  // Lấy danh sách độc giả có bản ghi quá hạn
  async getReadersWithOverdueBooks() {
    const currentDate = new Date(); // Ngày hiện tại
    const overdueRecords = await this.TheoDoiMuonSach.find({
      NgayTra: { $lt: currentDate }, // Ngày trả sách nhỏ hơn ngày hiện tại
      TrangThai: "Đang mượn", // Bản ghi chưa trả
    }).toArray();

    const readerIds = overdueRecords.map((record) => record.MaDocGia); // Lấy danh sách MaDocGia
    const readers = await this.DocGia.find({
      MaDocGia: { $in: readerIds },
    }).toArray(); // Lấy thông tin độc giả

    return readers;
  }
}

module.exports = TheoDoiMuonSachService;
