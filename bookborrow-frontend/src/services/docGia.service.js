import createApiClient from "./api.service.js"; // Import hàm tạo client API

class DocGiaService {
  constructor(baseUrl = "/api/docgias") {
    this.api = createApiClient(baseUrl); // Khởi tạo client API với baseUrl tương ứng
  }

  // Lấy tất cả độc giả
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Tạo mới một độc giả
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Xóa tất cả độc giả
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Lấy thông tin một độc giả theo ID
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Cập nhật thông tin độc giả
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa độc giả theo ID
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Tìm độc giả theo tên (tìm trong field "Ten")
  async findByName(name) {
    return (await this.api.get(`/search?name=${name}`)).data;
  }

  // Lấy danh sách sách đang mượn của độc giả theo MaDocGia
  async getBorrowedBooks(MaDocGia) {
    return (await this.api.get(`/borrowed/${MaDocGia}`)).data;
  }

  // Kiểm tra xem độc giả đã mượn sách chưa (trả về true/false)
  async checkBorrowedBooks(MaDocGia) {
    return (await this.api.get(`/check-borrowed/${MaDocGia}`)).data;
  }

  // Lấy số lượng sách đã mượn của độc giả
  async getBorrowedBooksCount(MaDocGia) {
    return (await this.api.get(`/borrowed-count/${MaDocGia}`)).data;
  }
}

export default new DocGiaService(); // Export một instance duy nhất của DocGiaService
