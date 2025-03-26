const NhanVienService = require("../services/nhanVien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo nhân viên
exports.create = async (req, res, next) => {
  if (!req.body?.HoTenNV || !req.body?.Password || !req.body?.ChucVu) {
    return next(new ApiError(400, "Vui lòng nhập đầy đủ thông tin bắt buộc"));
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

// Lấy tất cả hoặc tìm theo tên
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

// Lấy nhân viên theo ID
exports.findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
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

// Cập nhật nhân viên
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

// Xóa nhân viên
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

// Xóa tất cả nhân viên
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

// Đăng nhập
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // Kiểm tra đầu vào trước
  if (!username || !password) {
    return next(new ApiError(400, "Vui lòng nhập đầy đủ họ tên và mật khẩu"));
  }

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const user = await nhanVienService.login(username, password);

    if (!user) {
      return next(new ApiError(401, "Họ tên hoặc mật khẩu không đúng"));
    }

    res.json({
      message: "Đăng nhập thành công",
      user: {
        MSNV: user.MSNV,
        HoTenNV: user.HoTenNV,
        ChucVu: user.ChucVu,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error); // 👈 Thêm dòng này để debug
    return next(new ApiError(500, "Lỗi khi đăng nhập nhân viên"));
  }
};

// Đăng ký
exports.register = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const result = await nhanVienService.register(req.body);
    res.json({ message: "Đăng ký thành công", data: result });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "Lỗi khi đăng ký nhân viên" });
  }
};
