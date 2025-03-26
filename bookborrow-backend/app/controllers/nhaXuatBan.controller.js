const NhaXuatBanService = require("../services/nhaXuatBan.service");
const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm nhà xuất bản
exports.create = async (req, res, next) => {
  if (!req.body?.TenNXB || !req.body?.DiaChi) {
    return next(new ApiError(400, "Vui lòng nhập đầy đủ thông tin bắt buộc"));
  }
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.create(req.body);
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the nha xuat ban")
    );
  }
};

// Lấy tất cả sách hoặc tìm theo tên
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const { TenNXB } = req.query;
    if (TenNXB) {
      documents = await nhaXuatBanService.findByName(TenNXB);
    } else {
      documents = await nhaXuatBanService.find({});
    }
    res.json(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving nha xuat ban")
    );
  }
};

// Lấy nhà xuất bản theo ID
exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be empty"));
    }
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.findById(id);
    if (!document || !document.length) {
      return next(new ApiError(404, "Nha xuat ban not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error retrieving nha xuat ban with id=${req.params.id}`
      )
    );
  }
};

// Cập nhật nhà xuất bản
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    if (!id) {
      return next(new ApiError(400, "ID can not be valid"));
    }
    if (Object.keys(payload).length === 0) {
      return next(new ApiError(400, "Data to update can not be empty"));
    }
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.update(id, payload);
    if (!document) {
      return next(new ApiError(404, "Nha xuat ban not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating nha xuat ban with id=${req.params.id}`)
    );
  }
};

// Xóa nhà xuất bản
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not valid"));
    }
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const document = await nhaXuatBanService.delete(id);
    if (!document) {
      return next(new ApiError(404, "Nha xuat ban not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Could not delete nha xuat ban with id=${req.params.id}`
      )
    );
  }
};

// Xóa tất cả nhà xuất bản
exports.deleteAll = async (req, res, next) => {
  try {
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const deletedCount = await nhaXuatBanService.deleteAll();
    return res.send({
      message: `${deletedCount} nha xuat ban were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all nha xuat ban")
    );
  }
};

// Lấy danh sách sách theo MaNXB
exports.getBooksByPublisher = async (req, res, next) => {
  const { MaNXB } = req.params;
  try {
    const bookService = new BookService(MongoDB.client);
    const books = await bookService.find({ MaNXB }); // Truy vấn sách theo MaNXB
    res.json(books); // Trả về danh sách sách nếu tìm thấy
  } catch (error) {
    console.error("Error retrieving books:", error);
    return next(new ApiError(500, "Error retrieving books for publisher"));
  }
};

// Lấy thông tin nhà xuất bản từ MaNXB
exports.getPublisherInfo = async (req, res, next) => {
  try {
    const { MaNXB } = req.params;
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const publisher = await nhaXuatBanService.getPublisherInfo(MaNXB);
    if (!publisher) {
      return next(new ApiError(404, "Publisher not found"));
    }
    res.json(publisher);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error retrieving publisher info for MaNXB=${req.params.MaNXB}`
      )
    );
  }
};

// Phương thức kiểm tra MaNXB đã tồn tại hay chưa
exports.checkMaNXBExists = async (req, res, next) => {
  const { MaNXB } = req.params; // Lấy MaNXB từ tham số route
  try {
    // Gọi service để kiểm tra MaNXB có tồn tại không
    const exists = await NhaXuatBanService.checkMaNXBExists(MaNXB);
    res.json({ exists }); // Trả về true hoặc false
  } catch (error) {
    console.error("Error checking MaNXB:", error);
    return next(new ApiError(500, "Lỗi khi kiểm tra mã nhà xuất bản"));
  }
};
