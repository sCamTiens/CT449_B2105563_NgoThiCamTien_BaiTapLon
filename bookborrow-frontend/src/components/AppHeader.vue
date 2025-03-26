<template>
    <div class="navbar navbar-expand-lg m-0 p-0 bg-light shadow-sm">
        <div class="container">
            <!-- Logo -->
            <router-link to="/" class="navbar-brand">
                <img class="logo" src="../assets/images/logo1.png" />
            </router-link>

            <!-- Toggle (mobile) -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Tài khoản -->
            <div class="ms-auto position-relative">
                <button class="btn btn-light d-flex flex-column align-items-end" @click="toggleDropdown">
                    <span class="fw-bold username">{{ userName }}</span>
                </button>

                <!-- Dropdown -->
                <div v-if="showDropdown" class="dropdown-menu custom-dropdown show mt-2">
                    <template v-if="isLoggedIn">
                        <router-link class="dropdown-item account" to="/account">
                            <i class="fa fa-user"></i> Trang cá nhân
                        </router-link>
                        <router-link class="dropdown-item account" to="/logout">
                            <font-awesome-icon icon="right-from-bracket" /> Đăng xuất
                        </router-link>
                    </template>
                    <template v-else>
                        <router-link class="dropdown-item account" to="/login">
                            <i class="fa fa-user"></i> Đăng nhập
                        </router-link>
                        <router-link class="dropdown-item account" to="/register">
                            <i class="fa fa-pen-to-square"></i> Đăng ký
                        </router-link>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            nv: JSON.parse(localStorage.getItem("nhanvien")),
            showDropdown: false,
        };
    },
    computed: {
        isLoggedIn() {
            return !!this.nv;
        },
        userName() {
            return this.nv?.HoTenNV || "Tài khoản";
        },
    },
    methods: {
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
    },
};
</script>

<style>
.navbar {
    border-radius: 10px;
}

.custom-dropdown {
    left: 50% !important;
    transform: translateX(-50%);
}

.username {
    color: rgb(67, 43, 12);
    background-color: #ddbebe;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.username:hover {
    transform: scale(1.05);
    color: #fff;
    background-color: #54333f;
}

.logo {
    height: 100px;
    border-radius: 10px;
    padding: 5px;
}

.logo:hover {
    transform: scale(1.01);
}

.account {
    transition: all 0.2s ease-in-out;
    border-radius: 5px;
    margin: 2px;
}

/* Hover */
.account:hover {
    color: #fff;
    background-color: #54333f;
    transform: scale(1.01);
}

/* Khi click vào */
.account:active,
.account:focus,
.router-link-active.account {
    color: #fff !important;
    background-color: #54333f !important;
}
</style>