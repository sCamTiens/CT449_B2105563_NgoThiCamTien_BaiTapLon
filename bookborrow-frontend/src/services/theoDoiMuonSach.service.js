import createApiClient from "./api.service.js"; // Import hàm tạo client API

class TheoDoiMuonSachService {
  constructor(baseUrl = "/api/theoDoiMuonSach") {
    this.api = createApiClient(baseUrl); // Khởi tạo client API với baseUrl tương ứng
  }

  // Lấy tất cả bản ghi theo dõi mượn sách
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Tạo mới một bản ghi theo dõi mượn sách
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Xóa tất cả bản ghi theo dõi mượn sách
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Lấy thông tin một bản ghi theo ID
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Cập nhật bản ghi theo ID
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa bản ghi theo ID
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Lấy sách mà một độc giả đã mượn
  async getBooksByReader(MaDocGia) {
    return (await this.api.get(`/reader/${MaDocGia}`)).data;
  }

  // Lấy sách mà một nhân viên đã theo dõi mượn
  async getBooksByEmployee(MSNV) {
    return (await this.api.get(`/employee/${MSNV}`)).data;
  }

  // Lấy chi tiết sách theo MaSach
  async getBookDetails(MaSach) {
    return (await this.api.get(`/book-detail/${MaSach}`)).data;
  }

  // Kiểm tra tình trạng trả sách (true nếu đã trả)
  async checkReturnStatus(MaSach) {
    return (await this.api.get(`/check-return/${MaSach}`)).data;
  }
}

export default new TheoDoiMuonSachService(); // Export một instance duy nhất
