import createApiClient from "./api.service.js"; // Import hàm tạo client API

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl); // Khởi tạo client API với baseUrl tương ứng
  }

  // Lấy tất cả sách
  async getAll() {
    return (await this.api.get("/")).data; // Gọi API để lấy tất cả sách
  }

  // Tạo mới một sách
  async create(data) {
    return (await this.api.post("/", data)).data; // Gửi yêu cầu POST để tạo sách
  }

  // Xóa tất cả sách
  async deleteAll() {
    return (await this.api.delete("/")).data; // Gửi yêu cầu DELETE để xóa tất cả sách
  }

  // Lấy thông tin một sách theo ID
  async get(id) {
    return (await this.api.get(`/${id}`)).data; // Gửi yêu cầu GET để lấy sách theo ID
  }

  // Cập nhật thông tin sách
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data; // Gửi yêu cầu PUT để cập nhật sách
  }

  // Xóa sách theo ID
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data; // Gửi yêu cầu DELETE để xóa sách theo ID
  }

  // Tìm sách theo tên (TenSach)
  async findByName(name) {
    return (await this.api.get(`/search?name=${name}`)).data; // Tìm sách theo tên
  }

  // Tìm sách theo mã nhà xuất bản (MaNXB)
  async findByPublisher(MaNXB) {
    return (await this.api.get(`/publisher/${MaNXB}`)).data; // Tìm sách theo mã nhà xuất bản
  }

  // Lấy thông tin nhà xuất bản từ MaNXB
  async getPublisherInfo(MaNXB) {
    return (await this.api.get(`/publisher-info/${MaNXB}`)).data; // Lấy thông tin nhà xuất bản
  }

  // Lấy danh sách tất cả nhà xuất bản
  async getAllNXB() {
    return (await this.api.get("/publishers")).data; // Lấy tất cả nhà xuất bản
  }
}

export default new BookService(); // Export một instance duy nhất của BookService
