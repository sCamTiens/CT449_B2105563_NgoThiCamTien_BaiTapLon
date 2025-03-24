import createApiClient from "./api.service.js"; // Import hàm tạo client API

class NhanVienService {
  constructor(baseUrl = "/api/nhanVien") {
    this.api = createApiClient(baseUrl); // Khởi tạo client API với baseUrl tương ứng
  }

  // Lấy tất cả nhân viên
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Tạo mới một nhân viên
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Xóa tất cả nhân viên
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Lấy thông tin một nhân viên theo ID (MSNV)
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Cập nhật thông tin nhân viên
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa nhân viên theo ID
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Lấy danh sách sách mà nhân viên đang quản lý (theo dõi mượn)
  async getBorrowedBooks(MSNV) {
    return (await this.api.get(`/borrowed/${MSNV}`)).data;
  }

  // Nhân viên mượn sách
  async addBorrowedBook(MSNV, MaSach, NgayMuon) {
    return (await this.api.post(`/borrow/${MSNV}`, { MaSach, NgayMuon })).data;
  }

  // Nhân viên trả sách
  async returnBook(MaSach) {
    return (await this.api.put(`/return/${MaSach}`)).data;
  }
}

export default new NhanVienService(); // Export một instance duy nhất của NhanVienService
