const express = require("express");
const theoDoiMuonSach = require("../controllers/theoDoiMuonSach.controller");

const router = express.Router();

// Kiểm tra xem sách đã có trong danh sách mượn chưa
router.get("/check-book/:MaSach", theoDoiMuonSach.checkBookInBorrowList);

// Lấy sách mà độc giả đã mượn
router.get("/reader/:MaDocGia", theoDoiMuonSach.getBooksBorrowedByReader);

// Lấy sách mà nhân viên đã theo dõi mượn
router.get("/employee/:MSNV", theoDoiMuonSach.getBooksBorrowedByEmployee);

// Lấy chi tiết sách từ MaSach
router.get("/book-detail/:MaSach", theoDoiMuonSach.getBookDetails);

// Kiểm tra sách đã trả hay chưa
router.get("/check-return/:MaSach", theoDoiMuonSach.checkReturnStatus);

// CRUD chính
router
  .route("/")
  .get(theoDoiMuonSach.findAll)
  .post(theoDoiMuonSach.create)
  .delete(theoDoiMuonSach.deleteAll);

router
  .route("/:id")
  .get(theoDoiMuonSach.findOne)
  .put(theoDoiMuonSach.update)
  .delete(theoDoiMuonSach.delete);

module.exports = router;
