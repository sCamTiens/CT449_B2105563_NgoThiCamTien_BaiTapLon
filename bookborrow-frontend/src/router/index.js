import { createWebHistory, createRouter } from "vue-router";

// Import các views tương ứng
import BookList from "@/views/BookList.vue"; // Trang danh sách sách
import MuonSachList from "@/views/MuonSachList.vue"; // Trang quản lý mượn sách
import DocGiaList from "@/views/DocGiaList.vue"; // Trang quản lý độc giả
import NhaXuatBanList from "@/views/NhaXuatBanList.vue"; // Trang danh sách nhà xuất bản
import NhanVienList from "@/views/NhanVienList.vue"; // Trang danh sách nhân viên

const routes = [
  // Quản lý sách
  {
    path: "/",
    name: "booklist", // Tên route cho danh sách sách
    component: BookList, // Component cho danh sách sách
  },

  // // Thêm sách mới
  // {
  //   path: "/book/add",
  //   name: "book.add", // Route để thêm sách mới
  //   component: () => import("@/views/BookAdd.vue"),
  //   props: true,
  // },

  // // Sửa thông tin sách
  // {
  //   path: "/book/edit/:id",
  //   name: "book.edit",
  //   component: () => import("@/views/BookEdit.vue"),
  //   props: true,
  // },

  // Quản lý mượn sách
  {
    path: "/muonsach",
    name: "muonsachlist", // Tên route cho quản lý mượn sách
    component: MuonSachList, // Component quản lý mượn sách
  },
  // {
  //   path: "/muonsach/add",
  //   name: "muonsach.add", // Tên route cho quản lý mượn sách
  //   component: MuonSachList, // Component quản lý mượn sách
  // },
  // {
  //   path: "/muonsach",
  //   name: "muonsach.edit", // Tên route cho quản lý mượn sách
  //   component: MuonSachList, // Component quản lý mượn sách
  // },

  // Quản lý đọc giả
  {
    path: "/docgia",
    name: "docgialist",
    component: DocGiaList,
  },
  // {
  //   path: "/docgia/add",
  //   name: "docgia.add",
  //   component: DocGiaForm, // hoặc component thêm độc giả
  // },
  // {
  //   path: "/docgia/:id",
  //   name: "docgia.edit",
  //   component: DocGiaForm,
  //   props: true,
  // },

  // Quản lý nhà xuất bản
  {
    path: "/nhaxuatban",
    name: "nhaxuatbanlist",
    component: NhaXuatBanList,
  },
  // {
  //   path: "/nha-xuat-ban/add",
  //   name: "nxb.add",
  //   component: NhaXuatBanForm,
  // },
  // {
  //   path: "/nha-xuat-ban/:id",
  //   name: "nxb.edit",
  //   component: NhaXuatBanForm,
  //   props: true,
  // },

  // Quản lý nhân viên
  {
    path: "/nhanvien",
    name: "nhanvienlist",
    component: NhanVienList,
  },
  // {
  //   path: "/nhan-vien/add",
  //   name: "nhanvien.add",
  //   component: NhanVienForm,
  // },
  // {
  //   path: "/nhan-vien/:id",
  //   name: "nhanvien.edit",
  //   component: NhanVienForm,
  //   props: true,
  // },

  // Không có
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
