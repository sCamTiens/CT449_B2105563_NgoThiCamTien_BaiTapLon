const express = require("express");
const nhanVien = require("../controllers/nhanVien.controller");

const router = express.Router();

// Route để đăng nhập
router.post("/login", nhanVien.login);

// Route để đăng ký
router.post("/register", nhanVien.register);

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

module.exports = router;
