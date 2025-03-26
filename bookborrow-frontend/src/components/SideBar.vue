<template>
    <!-- Sidebar -->
    <div class="sidebar">
        <ul class="nav flex-column mt-3">
            <li class="nav-item">
                <router-link :to="{ name: 'book' }" class="nav-link" :class="{ active: isActiveRoute('book') }">
                    <font-awesome-icon icon="book" class="me-2" />
                    Sách
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'nhaxuatban' }" class="nav-link"
                    :class="{ active: isActiveRoute('nhaxuatban') }">
                    <font-awesome-icon icon="building" class="me-2" />
                    Nhà xuất bản
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'docgia' }" class="nav-link" :class="{ active: isActiveRoute('docgia') }">
                    <font-awesome-icon icon="user" class="me-2" />
                    Đọc giả
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'muonsach' }" class="nav-link" :class="{ active: isActiveRoute('muonsach') }">
                    <font-awesome-icon icon="book-open-reader" class="me-2" />
                    Mượn sách
                </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
                <router-link v-if="isAdmin" :to="{ name: 'nhanvien' }" class="nav-link"
                    :class="{ active: isActiveRoute('nhanvien') }">
                    <font-awesome-icon icon="users" class="me-2" />
                    Nhân viên
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    computed: {
        isAdmin() {
            const nv = JSON.parse(localStorage.getItem("nhanvien"));
            return nv?.ChucVu === "Admin";
        },
    },
    methods: {
        isActiveRoute(routeName) {
            return this.$route.name === routeName;
        },
    },
};
</script>

<style>
.sidebar {
    background: linear-gradient(135deg, #74ebd5, #acb6e5);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.1);
}

.nav-link {
    color: #000;
    padding: 12px 15px;
    margin-bottom: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s, color 0.3s;
}

.nav-item {
    list-style: none;
}

.nav-link:hover {
    background-color: #e9ecef;
    color: #000;
}

.nav-link.active {
    background-color: #073A4B;
    color: white;
}
</style>
