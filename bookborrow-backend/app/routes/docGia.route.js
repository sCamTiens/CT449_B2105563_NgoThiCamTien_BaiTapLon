const express = require("express");
const docGia = require("../controllers/docGia.controller");

const router = express.Router();

// Lấy số lượng sách mà độc giả đã mượn
router.get("/borrowed-count/:MaDocGia", docGia.countBorrowedBooks);

// Tìm độc giả theo tên
router.get("/search", docGia.findByName);

// Lấy danh sách sách đã mượn của độc giả
router.get("/borrowed/:MaDocGia", docGia.getBorrowedBooks);

// Kiểm tra độc giả đã mượn sách hay chưa
router.get("/check-borrowed/:MaDocGia", docGia.checkBorrowedBooks);

// Route để lấy tất cả độc giả, tạo mới hoặc xóa tất cả
router
  .route("/")
  .get(docGia.findAll) // Lấy tất cả độc giả
  .post(docGia.create) // Tạo mới độc giả
  .delete(docGia.deleteAll); // Xóa tất cả độc giả

// Route để thao tác với độc giả theo ID
router
  .route("/:id")
  .get(docGia.findOne) // Lấy độc giả theo ID
  .put(docGia.update) // Cập nhật độc giả theo ID
  .delete(docGia.delete); // Xóa độc giả theo ID

module.exports = router;
