import createApiClient from "./api.service.js"; // Import hàm tạo client API

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl); // Khởi tạo client API với baseUrl tương ứng
  }

  // Lấy tất cả sách
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Tạo mới một sách
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Xóa tất cả sách
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Lấy thông tin một sách theo ID
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Cập nhật thông tin sách
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa sách theo ID
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Tìm sách theo tên (TenSach)
  async findByName(name) {
    return (await this.api.get(`/search?name=${name}`)).data;
  }

  // Tìm sách theo mã nhà xuất bản (MaNXB)
  async findByPublisher(MaNXB) {
    return (await this.api.get(`/publisher/${MaNXB}`)).data;
  }

  // Lấy thông tin nhà xuất bản từ MaNXB
  async getPublisherInfo(MaNXB) {
    // Giả sử backend có route: /api/books/publisher-info/:MaNXB
    return (await this.api.get(`/publisher-info/${MaNXB}`)).data;
  }
}

export default new BookService();
