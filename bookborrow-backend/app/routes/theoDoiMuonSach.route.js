const express = require("express");
const theoDoiMuonSach = require("../controllers/theoDoiMuonSach.controller");

const router = express.Router();

// Route để lấy tất cả theo dõi mượn sách, tạo mới hoặc xóa tất cả
router
  .route("/")
  .get(theoDoiMuonSach.findAll) // Lấy tất cả bản ghi theo dõi mượn sách
  .post(theoDoiMuonSach.create) // Tạo mới bản ghi theo dõi mượn sách
  .delete(theoDoiMuonSach.deleteAll); // Xóa tất cả bản ghi theo dõi mượn sách

// Route để thao tác với bản ghi theo dõi mượn sách theo ID
router
  .route("/:id")
  .get(theoDoiMuonSach.findOne) // Lấy bản ghi theo ID
  .put(theoDoiMuonSach.update) // Cập nhật bản ghi theo ID
  .delete(theoDoiMuonSach.delete); // Xóa bản ghi theo ID

module.exports = router;
