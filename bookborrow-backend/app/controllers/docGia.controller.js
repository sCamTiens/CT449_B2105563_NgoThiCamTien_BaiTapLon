const DocgiaService = require("../services/docGia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
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

exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not be empty"));
    }
    const docgiaService = new DocgiaService(MongoDB.client);
    const document = await docgiaService.findById(id);
    if (!document || !document.length) {
      return next(new ApiError(404, "Docgia not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving docgia with id=${req.params.id}`)
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
    const docgiaService = new DocgiaService(MongoDB.client);
    const document = await docgiaService.update(id, payload);
    if (!document) {
      return next(new ApiError(404, "Docgia not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating docgia with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not valid"));
    }
    const docgiaService = new DocgiaService(MongoDB.client);
    const document = await docgiaService.delete(id);
    if (!document) {
      return next(new ApiError(404, "Docgia not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete docgia with id=${req.params.id}`)
    );
  }
};

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
