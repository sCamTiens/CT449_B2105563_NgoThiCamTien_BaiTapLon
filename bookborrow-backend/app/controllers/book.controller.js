const BookService = require("../services/book.service");
const NhaXuatBanService = require("../services/nhaXuatBan.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo mới sách
exports.create = async (req, res, next) => {
  if (
    !req.body?.TenSach ||
    !req.body?.DonGia ||
    !req.body?.SoQuyen ||
    !req.body?.NamXuatBan ||
    !req.body?.MaNXB ||
    !req.body?.TacGia
  ) {
    return next(new ApiError(400, "Vui lòng nhập đầy đủ thông tin bắt buộc"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    res.json(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

// Lấy tất cả sách hoặc tìm theo tên sách nếu có query TenSach
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const bookService = new BookService(MongoDB.client);
    const { TenSach } = req.query;
    if (TenSach) {
      documents = await bookService.findByName(TenSach);
    } else {
      documents = await bookService.find({});
    }
    res.json(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving books"));
  }
};

// Tìm sách theo ID
exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be empty"));
    }
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(id);
    if (!document || !document.length) {
      return next(new ApiError(404, "Book not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

// Cập nhật thông tin sách
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be valid"));
    }
    if (Object.keys(payload).length === 0) {
      return next(new ApiError(400, "Data to update can not be empty"));
    }
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(id, payload);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating book with id=${req.params.id}`)
    );
  }
};

// Xóa sách theo ID
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(id);
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};

// Xóa tất cả sách
exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();
    return res.send({
      message: `${deletedCount} books were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all books")
    );
  }
};

// Tìm sách theo tên (dành cho route /search?name=...)
exports.findByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    const bookService = new BookService(MongoDB.client);
    const documents = await bookService.findByName(name);
    res.json(documents);
  } catch (error) {
    return next(new ApiError(500, "Error finding book by name"));
  }
};

// Tìm sách theo mã nhà xuất bản
exports.findByPublisher = async (req, res, next) => {
  try {
    const { MaNXB } = req.params;
    const bookService = new BookService(MongoDB.client);
    const books = await bookService.findByPublisher(MaNXB);
    res.json(books);
  } catch (error) {
    return next(new ApiError(500, "Error finding books by publisher"));
  }
};

// Lấy thông tin nhà xuất bản từ MaNXB
exports.getPublisherInfo = async (req, res, next) => {
  try {
    const { MaNXB } = req.params;
    const bookService = new BookService(MongoDB.client);
    const publisher = await bookService.getPublisherInfo(MaNXB);
    if (!publisher) {
      return next(new ApiError(404, "Publisher not found"));
    }
    res.json(publisher);
  } catch (error) {
    return next(new ApiError(500, "Error retrieving publisher info"));
  }
};

// Lấy danh sách tất cả NXB
exports.getAllNXB = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const danhSachNXB = await nhaXuatBanService.find({});
    res.json(danhSachNXB);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách NXB:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách NXB" });
  }
};
