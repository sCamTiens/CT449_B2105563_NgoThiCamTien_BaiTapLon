const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.MaSach) {
    return next(new ApiError(400, "MaSach can not be empty"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    res.json(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

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

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ApiError(400, "Id can not valid"));
    }
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    res.json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};

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
