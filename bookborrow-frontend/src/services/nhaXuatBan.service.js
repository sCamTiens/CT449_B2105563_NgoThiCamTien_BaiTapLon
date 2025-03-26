import createApiClient from "./api.service.js";

class NhaXuatBanService {
  constructor(baseUrl = "/api/nhaxuatbans") {
    this.api = createApiClient(baseUrl); // Khởi tạo client API với baseUrl tương ứng
  }

  // Lấy tất cả nhà xuất bản
  async getAll() {
    return (await this.api.get("/")).data;
  }

  // Tạo mới một nhà xuất bản
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Xóa tất cả nhà xuất bản
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  // Lấy thông tin một nhà xuất bản theo ID (ObjectId)
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Cập nhật thông tin nhà xuất bản
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  // Xóa nhà xuất bản theo ID
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Lấy danh sách sách của nhà xuất bản theo MaNXB
  async getBooksByPublisher(MaNXB) {
    return (await this.api.get(`/book/${MaNXB}`)).data;
  }

  // Lấy thông tin nhà xuất bản theo MaNXB (không dùng ObjectId)
  async getPublisherInfo(MaNXB) {
    return (await this.api.get(`/info/${MaNXB}`)).data;
  }

  //Kiểm tra xem MaNXB có tồn tại trong cơ sở dữ liệu không
  // async checkMaNXBExists(MaNXB) {
  //   return (await this.api.get(`/checkMaNXB/${MaNXB}`)).data;
  // }
}

export default new NhaXuatBanService(); // Export một instance duy nhất của NhaXuatBanService
