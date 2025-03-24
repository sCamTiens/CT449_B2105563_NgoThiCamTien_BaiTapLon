const express = require("express");
const docGia = require("../controllers/docGia.controller");

const router = express.Router();

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
