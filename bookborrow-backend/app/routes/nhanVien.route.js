const express = require("express");
const nhanVien = require("../controllers/nhanVien.controller");

const router = express.Router();

// Route để lấy tất cả nhân viên, tạo mới hoặc xóa tất cả
router
  .route("/")
  .get(nhanVien.findAll)
  .post(nhanVien.create)
  .delete(nhanVien.deleteAll);

// Route để thao tác với nhân viên theo ID
router
  .route("/:id")
  .get(nhanVien.findOne)
  .put(nhanVien.update)
  .delete(nhanVien.delete);

// Route: Lấy danh sách sách mà nhân viên đang theo dõi
router.get("/borrowed/:MSNV", nhanVien.getBooksByEmployee);

// Route: Nhân viên mượn sách (thêm mượn sách mới)
router.post("/borrow/:MSNV", nhanVien.addBorrowedBook);

// Route: Trả sách
router.put("/return/:MaSach", nhanVien.returnBook);

module.exports = router;
