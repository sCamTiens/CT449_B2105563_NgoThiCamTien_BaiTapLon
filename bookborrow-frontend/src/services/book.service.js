import createApiClient from "./api.service.js"; // Import hàm tạo client API

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl); // Khởi tạo client API với baseUrl tương ứng
  }

  // Lấy tất cả sách
  async getAll() {
    try {
      const response = await this.api.get("/"); // Gọi API để lấy tất cả sách
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error fetching books:", error); // Log lỗi nếu có
      throw error;
    }
  }

  // Tạo mới một sách
  async create(data) {
    try {
      const response = await this.api.post("/", data); // Gửi yêu cầu POST để tạo sách
      return response.data; // Trả về dữ liệu sách mới
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  }

  // Xóa tất cả sách
  async deleteAll() {
    try {
      const response = await this.api.delete("/"); // Gửi yêu cầu DELETE để xóa tất cả sách
      return response.data; // Trả về dữ liệu phản hồi
    } catch (error) {
      console.error("Error deleting books:", error);
      throw error;
    }
  }

  // Lấy thông tin một sách theo ID
  async get(id) {
    try {
      const response = await this.api.get(`/${id}`); // Gửi yêu cầu GET để lấy sách theo ID
      return response.data; // Trả về dữ liệu sách theo ID
    } catch (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
  }

  // Cập nhật thông tin sách
  async update(id, data) {
    try {
      const response = await this.api.put(`/${id}`, data); // Gửi yêu cầu PUT để cập nhật sách
      return response.data; // Trả về dữ liệu sách đã cập nhật
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  }

  // Xóa sách theo ID
  async delete(id) {
    try {
      const response = await this.api.delete(`/${id}`); // Gửi yêu cầu DELETE để xóa sách theo ID
      return response.data; // Trả về dữ liệu phản hồi
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }

  // Tìm sách theo tên (TenSach)
  async findByName(name) {
    try {
      const response = await this.api.get(`/search?name=${name}`); // Tìm sách theo tên
      return response.data; // Trả về kết quả tìm kiếm
    } catch (error) {
      console.error("Error searching book:", error);
      throw error;
    }
  }

  // Tìm sách theo mã nhà xuất bản (MaNXB)
  async findByPublisher(MaNXB) {
    try {
      const response = await this.api.get(`/publisher/${MaNXB}`); // Tìm sách theo mã nhà xuất bản
      return response.data; // Trả về kết quả tìm kiếm theo publisher
    } catch (error) {
      console.error("Error searching book by publisher:", error);
      throw error;
    }
  }

  // Lấy thông tin nhà xuất bản từ MaNXB
  async getPublisherInfo(MaNXB) {
    try {
      const response = await this.api.get(`/publisher-info/${MaNXB}`); // Lấy thông tin nhà xuất bản
      return response.data; // Trả về thông tin nhà xuất bản
    } catch (error) {
      console.error("Error fetching publisher info:", error);
      throw error;
    }
  }

  // Lấy danh sách tất cả nhà xuất bản
  async getAllNXB() {
    try {
      const response = await this.api.get("/publishers");
      return response.data;
    } catch (error) {
      console.error("Error fetching publisher list:", error);
      throw error;
    }
  }
}

export default new BookService();
