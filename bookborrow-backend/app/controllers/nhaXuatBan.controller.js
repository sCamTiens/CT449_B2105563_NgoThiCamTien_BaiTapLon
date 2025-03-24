const NhaXuatBanService = require("../services/nhaXuatBan.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm nhà xuất bản
exports.create = async (req, res, next) => {
  if (!req.body?.MaNXB) {
    return next(new ApiError(400, "MaNXB can not be empty"));
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

// Lấy nahf xuất bản theo ID
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
      return next(new ApiError(400, "Id can not be valid"));
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
  try {
    const { MaNXB } = req.params;
    const nhaXuatBanService = new NhaXuatBanService(MongoDB.client);
    const books = await nhaXuatBanService.getBooksByPublisher(MaNXB);
    res.json(books);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Error retrieving books for publisher MaNXB=${req.params.MaNXB}`
      )
    );
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
