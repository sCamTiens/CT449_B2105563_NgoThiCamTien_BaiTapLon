const DocgiaService = require("../services/docGia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo mới độc giả
exports.create = async (req, res, next) => {
  if (
    !req.body?.HoLot ||
    !req.body?.Ten ||
    !req.body?.NgaySinh ||
    !req.body?.Phai ||
    !req.body?.DiaChi ||
    !req.body?.DienThoai
  ) {
    return next(new ApiError(400, "Vui lòng nhập đầy đủ thông tin bắt buộc"));
  }
  if (!req.body?.MaDocGia) {
    return next(new ApiError(400, "MaDocGia can not be empty"));
  }
  try {
    const docgiaService = new DocgiaService(MongoDB.client);
    const document = await docgiaService.create(req.body);
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the docgia")
    );
  }
};

// Lấy tất cả hoặc tìm theo tên (query ?Ten=...)
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const docgiaService = new DocgiaService(MongoDB.client);
    const { Ten } = req.query;
    if (Ten) {
      documents = await docgiaService.findByName(Ten);
    } else {
      documents = await docgiaService.find({});
    }
    res.json(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving docgia"));
  }
};

// Lấy độc giả theo ID
exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const docgiaService = new DocgiaService(MongoDB.client);
    const document = await docgiaService.findById(id);
    if (!document || !document.length) {
      return next(new ApiError(404, "Docgia not found"));
    }
    res.json(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving docgia with id=${id}`));
  }
};

// Cập nhật độc giả
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    if (!id) return next(new ApiError(400, "Id can not be valid"));
    if (Object.keys(payload).length === 0) {
      return next(new ApiError(400, "Data to update can not be empty"));
    }

    const docgiaService = new DocgiaService(MongoDB.client);
    const document = await docgiaService.update(id, payload);
    if (!document) {
      return next(new ApiError(404, "Docgia not found"));
    }
    res.json(document);
  } catch (error) {
    return next(new ApiError(500, `Error updating docgia with id=${id}`));
  }
};

// Xóa độc giả theo ID
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const docgiaService = new DocgiaService(MongoDB.client);
    const document = await docgiaService.delete(id);
    if (!document) {
      return next(new ApiError(404, "Docgia not found"));
    }
    res.json(document);
  } catch (error) {
    return next(new ApiError(500, `Could not delete docgia with id=${id}`));
  }
};

// Xóa tất cả độc giả
exports.deleteAll = async (req, res, next) => {
  try {
    const docgiaService = new DocgiaService(MongoDB.client);
    const deletedCount = await docgiaService.deleteAll();
    return res.send({
      message: `${deletedCount} docgia were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all docgia")
    );
  }
};

// Tìm độc giả theo tên (dành riêng cho /search?name=)
exports.findByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    const docgiaService = new DocgiaService(MongoDB.client);
    const documents = await docgiaService.findByName(name);
    res.json(documents);
  } catch (error) {
    return next(new ApiError(500, "Error finding docgia by name"));
  }
};

// Lấy danh sách sách đã mượn của độc giả
exports.getBorrowedBooks = async (req, res, next) => {
  try {
    const { MaDocGia } = req.params;
    const docgiaService = new DocgiaService(MongoDB.client);
    const borrowedBooks = await docgiaService.getBorrowedBooks(MaDocGia);
    res.json(borrowedBooks);
  } catch (error) {
    return next(new ApiError(500, "Error getting borrowed books"));
  }
};

// Kiểm tra độc giả đã mượn sách chưa
exports.checkBorrowedBooks = async (req, res, next) => {
  try {
    const { MaDocGia } = req.params;
    const docgiaService = new DocgiaService(MongoDB.client);
    const hasBorrowed = await docgiaService.checkBorrowedBooks(MaDocGia);
    res.json({ hasBorrowed }); // Trả về object: { hasBorrowed: true/false }
  } catch (error) {
    return next(new ApiError(500, "Error checking borrowed books"));
  }
};

// Đếm số lượng sách mà độc giả đã mượn
exports.countBorrowedBooks = async (req, res, next) => {
  const { MaDocGia } = req.params;
  try {
    const docgiaService = new DocgiaService(MongoDB.client);
    const count = await docgiaService.countBorrowedBooks(MaDocGia);
    res.json({ count });
  } catch (error) {
    return next(new ApiError(500, "Error counting borrowed books for reader"));
  }
};
