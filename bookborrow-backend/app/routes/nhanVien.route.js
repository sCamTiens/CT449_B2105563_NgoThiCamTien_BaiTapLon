const express = require("express");
const nhanVien = require("../controllers/nhanVien.controller");

const router = express.Router();

// Route để lấy tất cả nhân viên, tạo mới hoặc xóa tất cả
router
  .route("/")
  .get(nhanVien.findAll) // Lấy tất cả nhân viên
  .post(nhanVien.create) // Tạo mới nhân viên
  .delete(nhanVien.deleteAll); // Xóa tất cả nhân viên

// Route để thao tác với nhân viên theo ID
router
  .route("/:id")
  .get(nhanVien.findOne) // Lấy nhân viên theo ID
  .put(nhanVien.update) // Cập nhật nhân viên theo ID
  .delete(nhanVien.delete); // Xóa nhân viên theo ID

module.exports = router;
