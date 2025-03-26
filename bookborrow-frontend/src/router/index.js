import { createWebHistory, createRouter } from "vue-router";
import NhaXuatBan from "@/views/NhaXuatBan.vue";
import Book from "@/views/Book.vue";
import DocGia from "@/views/DocGia.vue";
import MuonSach from "@/views/MuonSach.vue";
import NhanVien from "@/views/NhanVien.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Logout from "@/views/Logout.vue";
import Account from "@/views/Account.vue";

const routes = [
  // Trang mặc định: chuyển hướng "/" về "/login"
  {
    path: "/",
    redirect: "/login",
  },

  // Trang đăng nhập
  {
    path: "/login",
    name: "login",
    component: Login,
  },

  // Trang đăng ký
  {
    path: "/register",
    name: "register",
    component: Register,
  },

  // Trang tài khoản
  {
    path: "/account",
    name: "account",
    component: Account,
  },

  // Trang xuất
  {
    path: "/logout",
    name: "logout",
    component: Logout,
  },

  // Quản lý sách
  {
    path: "/books",
    name: "book",
    component: Book,
  },
  {
    path: "/books/:id",
    name: "book.edit",
    component: () => import("@/views/edit/BookEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/books",
    name: "book.add",
    component: () => import("@/views/add/BookAdd.vue"),
  },

  // Quản lý đọc giả
  {
    path: "/docgias",
    name: "docgia",
    component: DocGia,
  },
  {
    path: "/docgias/:id",
    name: "docgia.edit",
    component: () => import("@/views/edit/DocGiaEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/docgias",
    name: "docgia.add",
    component: () => import("@/views/add/DocGiaAdd.vue"),
  },

  // Quản lý mượn sách
  {
    path: "/muonsachs",
    name: "muonsach",
    component: MuonSach,
  },
  {
    path: "/muonsachs/:id",
    name: "muonsach.edit",
    component: () => import("@/views/edit/MuonSachEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/muonsachs",
    name: "muonsach.add",
    component: () => import("@/views/add/MuonSachAdd.vue"),
  },

  // Quản lý nhân viên
  {
    path: "/nhanviens",
    name: "nhanvien",
    component: NhanVien,
  },
  {
    path: "/nhanviens/:id",
    name: "nhanvien.edit",
    component: () => import("@/views/edit/NhanVienEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/nhanviens",
    name: "nhanvien.add",
    component: () => import("@/views/add/NhanVienAdd.vue"),
  },

  // Quản lý nhà sản xuất
  {
    path: "/nhaxuatbans",
    name: "nhaxuatban",
    component: NhaXuatBan,
  },
  {
    path: "/nhaxuatbans/:id",
    name: "nhaxuatban.edit",
    component: () => import("@/views/edit/NhaXuatBanEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/nhaxuatbans",
    name: "nhaxuatban.add",
    component: () => import("@/views/add/NhaXuatBanAdd.vue"),
  },

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
