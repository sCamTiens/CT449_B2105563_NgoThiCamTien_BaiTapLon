const TheoDoiMuonSachService = require("../services/theoDoiMuonSach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

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
