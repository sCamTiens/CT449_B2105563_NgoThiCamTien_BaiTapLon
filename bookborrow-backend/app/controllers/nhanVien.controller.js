const NhanVienService = require("../services/nhanVien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.MSNV) {
    return next(new ApiError(400, "MSNV can not be empty"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.create(req.body);
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the nhan vien")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const { HoTenNV } = req.query;
    if (HoTenNV) {
      documents = await nhanVienService.findByName(HoTenNV);
    } else {
      documents = await nhanVienService.find({});
    }
    res.json(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving nhan vien")
    );
  }
};

exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be empty"));
    }
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findById(id);
    if (!document || !document.length) {
      return next(new ApiError(404, "Nhan vien not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving nhan vien with id=${req.params.id}`)
    );
  }
};

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
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.update(id, payload);
    if (!document) {
      return next(new ApiError(404, "Nhan vien not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating nhan vien with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not valid"));
    }
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(id);
    if (!document) {
      return next(new ApiError(404, "Nhan vien not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete nhan vien with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const deletedCount = await nhanVienService.deleteAll();
    return res.send({
      message: `${deletedCount} nhan vien were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all nhan vien")
    );
  }
};
