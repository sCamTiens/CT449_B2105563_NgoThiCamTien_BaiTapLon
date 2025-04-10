const express = require("express");
const cors = require("cors");
const nxbRouter = require("./app/routes/nhaXuatBan.route");
const bookRouter = require("./app/routes/book.route");
const nhanVienRouter = require("./app/routes/nhanVien.route");
const docGiaRouter = require("./app/routes/docGia.route");
const muonSachRouter = require("./app/routes/theoDoiMuonSach.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

app.use("/api/nhaxuatbans", nxbRouter);
app.use("/api/books", bookRouter);
app.use("/api/nhanviens", nhanVienRouter);
app.use("/api/docgias", docGiaRouter);
app.use("/api/muonsachs", muonSachRouter);

// handle 404 response
app.use((req, res, next) => {
  // Code ở đây sẽ chạy khi không có route được định nghĩa nào
  // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
  return next(new ApiError(404, "Resource not found"));
});
// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
  // Middleware xử lý lỗi tập trung.
  // Trong các đoạn code xử lý ở các route, gọi next(error)
  // sẽ chuyển về middleware xử lý lỗi này
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
