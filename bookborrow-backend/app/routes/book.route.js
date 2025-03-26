const express = require("express");
const books = require("../controllers/book.controller");

const router = express.Router();

// Tìm sách theo tên
router.get("/search", books.findByName);

// Tìm sách theo mã nhà xuất bản
router.get("/publisher/:MaNXB", books.findByPublisher);

// Lấy thông tin nhà xuất bản
router.get("/publisher-info/:MaNXB", books.getPublisherInfo);

// Route để lấy danh sách nhà xuất bản từ bảng NhaXuatBan
router.get("/publishers", books.getAllNXB);

// Route để lấy tất cả sách, tạo mới sách, hoặc xóa tất cả sách
router
  .route("/")
  .get(books.findAll) // Lấy danh sách sách
  .post(books.create) // Tạo mới sách
  .delete(books.deleteAll); // Xóa tất cả sách

// Route để thao tác với sách theo ID (get, update, delete)
router
  .route("/:id")
  .get(books.findOne) // Lấy sách theo ID
  .put(books.update) // Cập nhật sách theo ID
  .delete(books.delete); // Xóa sách theo ID

module.exports = router;
