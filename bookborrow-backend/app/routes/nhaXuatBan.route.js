const express = require("express");
const nhaXuatBan = require("../controllers/nhaXuatBan.controller");

const router = express.Router();

// Route để lấy tất cả nhà xuất bản, tạo mới hoặc xóa tất cả
router
  .route("/")
  .get(nhaXuatBan.findAll)
  .post(nhaXuatBan.create)
  .delete(nhaXuatBan.deleteAll);

// Route để thao tác với nhà xuất bản theo ID
router
  .route("/:id")
  .get(nhaXuatBan.findOne)
  .put(nhaXuatBan.update)
  .delete(nhaXuatBan.delete);

// Route: Lấy sách theo mã nhà xuất bản
router.get("/books/:MaNXB", nhaXuatBan.getBooksByPublisher);

// Route: Lấy thông tin nhà xuất bản theo mã (MaNXB)
router.get("/info/:MaNXB", nhaXuatBan.getPublisherInfo);

module.exports = router;
