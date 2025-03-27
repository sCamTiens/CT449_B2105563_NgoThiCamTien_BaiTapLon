const { ObjectId } = require("mongodb");

class DocgiaService {
  constructor(client) {
    this.Docgia = client.db().collection("Docgia");
    this.TheoDoiMuonSach = client.db().collection("TheoDoiMuonSach");
  }

  // Định nghĩa phương thức xử lý dữ liệu độc giả (extract)
  extractDocgiaData(payload) {
    const docgia = {
      MaDocGia: payload.MaDocGia,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
    };
    // Xóa các trường không có dữ liệu
    Object.keys(docgia).forEach((key) => !docgia[key] && delete docgia[key]);
    return docgia;
  }

  // // Tạo mới độc giả
  // async create(payload) {
  //   // Nếu không có MaDocGia, tự tạo mã mới
  //   if (!payload.MaDocGia) {
  //     const latest = await this.Docgia.find({})
  //       .sort({ MaDocGia: -1 }) // Sắp xếp giảm dần theo MaDocGia
  //       .limit(1)
  //       .toArray();

  //     let nextNumber = 1;

  //     if (latest.length > 0) {
  //       const lastMaDocGia = latest[0].MaDocGia;
  //       const match = lastMaDocGia.match(/\d+$/); // Lấy phần số ở cuối
  //       if (match) {
  //         nextNumber = parseInt(match[0]) + 1;
  //       }
  //     }

  //     payload.MaDocGia = `DG${nextNumber.toString().padStart(3, "0")}`;
  //   }

  //   const docgia = this.extractDocgiaData(payload);
  //   const result = await this.Docgia.findOneAndUpdate(
  //     { MaDocGia: docgia.MaDocGia },
  //     { $set: docgia },
  //     { returnDocument: "after", upsert: true }
  //   );
  //   return result;
  // }

  // Phương thức lấy mã độc giả mới nhất
  async getLatestDocGia() {
    try {
      const latest = await this.Docgia.find({}) // Lấy tất cả các bản ghi trong bảng Docgia
        .sort({ MaDocGia: -1 }) // Sắp xếp giảm dần theo MaDocGia
        .limit(1) // Lấy chỉ bản ghi đầu tiên
        .toArray();

      return latest[0]; // Trả về đối tượng độc giả mới nhất
    } catch (error) {
      console.error("Lỗi khi lấy độc giả mới nhất:", error);
      throw new Error("Không thể lấy thông tin độc giả mới nhất");
    }
  }

  // Tạo mới độc giả
  async create(payload) {
    // Nếu không có MaDocGia, tự tạo mã mới
    if (!payload.MaDocGia) {
      const latest = await this.getLatestDocGia(); // Gọi phương thức lấy mã độc giả mới nhất
      let nextNumber = 1;

      if (latest) {
        const lastMaDocGia = latest.MaDocGia;
        const match = lastMaDocGia.match(/\d+$/); // Lấy phần số ở cuối
        if (match) {
          nextNumber = parseInt(match[0]) + 1;
        }
      }

      payload.MaDocGia = `DG${nextNumber.toString().padStart(3, "0")}`; // Sinh mã độc giả
    }

    const docgia = this.extractDocgiaData(payload);
    const result = await this.Docgia.findOneAndUpdate(
      { MaDocGia: docgia.MaDocGia },
      { $set: docgia },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  // Tìm kiếm độc giả theo filter
  async find(filter) {
    const cursor = await this.Docgia.find(filter);
    return await cursor.toArray();
  }

  // Tìm độc giả theo tên
  async findByName(name) {
    return await this.find({
      Ten: { $regex: new RegExp(name), $options: "i" }, // Tìm theo tên độc giả
    });
  }

  // Tìm độc giả theo ID
  async findById(id) {
    const result = await this.find({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Cập nhật thông tin độc giả theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractDocgiaData(payload);
    const result = await this.Docgia.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa độc giả theo ID
  async delete(id) {
    const result = await this.Docgia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả độc giả
  async deleteAll() {
    const result = await this.Docgia.deleteMany({});
    return result.deletedCount;
  }

  // Lấy thông tin mượn sách của độc giả
  async getBorrowedBooks(MaDocGia) {
    const borrowedBooks = await this.TheoDoiMuonSach.find({
      MaDocGia,
    }).toArray();
    return borrowedBooks;
  }

  // Kiểm tra xem độc giả đã mượn sách hay chưa
  async checkBorrowedBooks(MaDocGia) {
    const borrowedBooks = await this.getBorrowedBooks(MaDocGia);
    return borrowedBooks.length > 0; // Trả về true nếu đã mượn sách
  }

  // Đếm số lượng sách mà độc giả đã mượn
  async countBorrowedBooks(MaDocGia) {
    try {
      // Tìm tất cả các bản ghi mượn sách của độc giả với MaDocGia
      const borrowedBooks = await this.TheoDoiMuonSach.find({
        MaDocGia,
      }).toArray();

      // Trả về số lượng sách đã mượn
      return borrowedBooks.length;
    } catch (error) {
      console.error("Lỗi khi đếm sách mượn:", error);
      throw new Error("Lỗi khi đếm sách mượn của độc giả");
    }
  }
}

module.exports = DocgiaService;
