const TheoDoiMuonSachService = require("../services/theoDoiMuonSach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo mới theo dõi mượn sách
exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach) {
    return next(new ApiError(400, "MaDocGia and MaSach can not be empty"));
  }
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await theoDoiMuonSachService.create(req.body);
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        "An error occurred while creating the theo dõi mượn sách"
      )
    );
  }
};

// Lấy tất cả theo dõi mượn sách
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const { MaDocGia, MaSach } = req.query;
    if (MaDocGia && MaSach) {
      documents = await theoDoiMuonSachService.findByDocGiaAndSach(
        MaDocGia,
        MaSach
      );
    } else {
      documents = await theoDoiMuonSachService.find({});
    }
    res.json(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving theo dõi mượn sách")
    );
  }
};

// Lấy thông tin theo dõi mượn sách theo ID
exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be empty"));
    }
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await theoDoiMuonSachService.findById(id);
    if (!document || !document.length) {
      return next(new ApiError(404, "Theo dõi mượn sách not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error retrieving theo dõi mượn sách with id=${req.params.id}`
      )
    );
  }
};

// Cập nhật theo dõi mượn sách theo ID
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
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await theoDoiMuonSachService.update(id, payload);
    if (!document) {
      return next(new ApiError(404, "Theo dõi mượn sách not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error updating theo dõi mượn sách with id=${req.params.id}`
      )
    );
  }
};

// Xóa theo dõi mượn sách theo ID
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not valid"));
    }
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await theoDoiMuonSachService.delete(id);
    if (!document) {
      return next(new ApiError(404, "Theo dõi mượn sách not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Could not delete theo dõi mượn sách with id=${req.params.id}`
      )
    );
  }
};

// Xóa tất cả theo dõi mượn sách
exports.deleteAll = async (req, res, next) => {
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const deletedCount = await theoDoiMuonSachService.deleteAll();
    return res.send({
      message: `${deletedCount} theo dõi mượn sách were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        "An error occurred while removing all theo dõi mượn sách"
      )
    );
  }
};

// Lấy danh sách sách mà độc giả đã mượn
exports.getBooksBorrowedByReader = async (req, res, next) => {
  try {
    const { MaDocGia } = req.params;
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const books = await service.getBooksBorrowedByReader(MaDocGia);
    res.json(books);
  } catch (error) {
    return next(new ApiError(500, "Error getting books for reader"));
  }
};

// Lấy danh sách sách mượn bởi nhân viên
exports.getBooksBorrowedByEmployee = async (req, res, next) => {
  try {
    const { MSNV } = req.params;
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const books = await service.getBooksBorrowedByEmployee(MSNV);
    res.json(books);
  } catch (error) {
    return next(new ApiError(500, "Error getting books for employee"));
  }
};

// Lấy thông tin chi tiết sách theo MaSach
exports.getBookDetails = async (req, res, next) => {
  try {
    const { MaSach } = req.params;
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const book = await service.getBookDetails(MaSach);
    if (!book) {
      return next(new ApiError(404, "Book not found"));
    }
    res.json(book);
  } catch (error) {
    return next(new ApiError(500, "Error retrieving book details"));
  }
};

// Kiểm tra sách đã trả hay chưa
exports.checkReturnStatus = async (req, res, next) => {
  try {
    const { MaSach } = req.params;
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const isReturned = await service.checkReturnStatus(MaSach);
    res.json({ MaSach, isReturned });
  } catch (error) {
    return next(new ApiError(500, "Error checking return status"));
  }
};

// Kiểm tra xem sách đã có trong danh sách mượn chưa
exports.checkBookInBorrowList = async (req, res, next) => {
  try {
    const { MaSach } = req.params;
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const exists = await theoDoiMuonSachService.checkBookExistsInBorrowList(
      MaSach
    );
    res.json({ exists });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi kiểm tra sách trong bản ghi mượn"));
  }
};
