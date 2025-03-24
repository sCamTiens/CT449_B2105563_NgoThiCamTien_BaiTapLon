const express = require("express");
const nhaXuatBan = require("../controllers/nhaXuatBan.controller");

const router = express.Router();

// Route để lấy tất cả nhà xuất bản, tạo mới hoặc xóa tất cả
router
  .route("/")
  .get(nhaXuatBan.findAll) // Lấy tất cả nhà xuất bản
  .post(nhaXuatBan.create) // Tạo mới nhà xuất bản
  .delete(nhaXuatBan.deleteAll); // Xóa tất cả nhà xuất bản

// Route để thao tác với nhà xuất bản theo ID
router
  .route("/:id")
  .get(nhaXuatBan.findOne) // Lấy nhà xuất bản theo ID
  .put(nhaXuatBan.update) // Cập nhật nhà xuất bản theo ID
  .delete(nhaXuatBan.delete); // Xóa nhà xuất bản theo ID

module.exports = router;
